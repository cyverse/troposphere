define(function (require) {

    var React = require('react/addons'),
        Backbone = require('backbone'),
        stores = require('stores'),
        _ = require('underscore'),
        ImageVersionCollection = require('collections/ImageVersionCollection'),
        VersionSelect = require('../components/VersionSelect.react'),
        IdentitySelect = require('../components/IdentitySelect.react');

    return React.createClass({
      displayName: "InstanceLaunchWizardModal-NameIdentityVersionStep",

        propTypes: {
            image: React.PropTypes.instanceOf(Backbone.Model),
            version: React.PropTypes.instanceOf(Backbone.Model),
            identity: React.PropTypes.instanceOf(Backbone.Model),
            allVersions: React.PropTypes.instanceOf(Backbone.Collection),
            name: React.PropTypes.string,
            onPrevious: React.PropTypes.func.isRequired,
            onNext: React.PropTypes.func.isRequired
        },

        getInitialState: function () {
            return {
                name: this.props.name || "",
                version: this.props.version,
                identity: this.props.identity,
                allVersions: stores.ImageStore.getVersions(this.props.image.id),
            };
        },
        isSubmittable: function () {
            if (!this.state.identity)
                return false
            var allocation = this.state.identity.get('usage'),
            // Allocation Usage cannot exceed 100%
                allocationUsageStats = this.calculateAllocationUsage(allocation);
            //TODO: Short-circuit on isStaff

            return (this.state.name.trim() && this.state.version && this.state.identity && allocationUsageStats.percentUsed < 1);
        },
        confirm: function () {
            var name = this.state.name.trim(),
                version = this.state.version,
                identity = this.state.identity,
                allVersions = this.state.allVersions;
            
            this.props.onNext({name: name, version: version, identity: identity, allVersions: allVersions});
        },
        onBack: function () {
            this.props.onPrevious(this.state);
        },
        componentDidMount: function () {
            stores.IdentityStore.addChangeListener(this.updateState);
            stores.ProviderMachineStore.addChangeListener(this.updateState);
            this.focusInput();
        },

        componentWillUnmount: function () {
            stores.IdentityStore.removeChangeListener(this.updateState);
            stores.ProviderMachineStore.removeChangeListener(this.updateState);
        },

        onNameChange: function (e) {
            var newName = e.target.value;
            this.setState({name: newName});
        },

        onVersionChange: function (e) {
            var newVersionId = e.target.value;
            if(!this.state.allVersions) {
              var versions = stores.ImageStore.getVersions(this.props.image.id);
              this.setState({allVersions:versions});
            } else {
              versions = this.state.allVersions
            }
            var selectedVersion = versions.get(newVersionId);
            this.setState({version: selectedVersion});
        },

        onIdentityChange: function (e) {
            var newIdentityId = e.target.value;
            var selectedIdentity = stores.IdentityStore.get(newIdentityId);
            this.setState({identity: selectedIdentity});
        },
        cleanVersions: function (versions) {
            // don't show duplicate images
            versions = new versions.constructor(_.uniq(versions.models, function (v) {
                return v.id;
            }));
            //TODO: Sort Me!
            return versions;
        },
        calculateAllocationUsage: function (allocation) {
            var maxAllocation = allocation.threshold;
            var currentAllocation = allocation.current;

            return {
                currentUsage: currentAllocation,
                maxAllocation: maxAllocation,
                percentUsed: currentAllocation / maxAllocation
            };
        },
        renderAllocationConsumption: function (identity) {
            if (!identity) {
                var overage_message = (
                    <div>
                        <strong>Select another Provider.</strong>
                        <span>{" Choose another provider to launch a new instance."}</span>
                    </div>
                );
                return this.renderProgressBar("No Identity Selected", 101, 0, overage_message);
            }
            var allocation = identity.get('usage'),
            // Allocation Usage
                allocationUsageStats = this.calculateAllocationUsage(allocation),

            // convert to percentages
                currentlyUsed = allocationUsageStats.currentUsage,
                maximumAllowed = allocationUsageStats.maxAllocation,
                currentlyUsedPercent = allocationUsageStats.percentUsed * 100,
                message = (
                "You have currently used " + (Math.round(currentlyUsed)) + " of " + maximumAllowed + " AUs on this Provider."
                ),
                overQuotaMessage = (
                    <div>
                        <strong>CPU quota exceeded.</strong>
                        <span>{" Choose another provider or request more resources to launch a new instance."}</span>
                    </div>
                );

            return this.renderProgressBar(message, currentlyUsedPercent, 0, overQuotaMessage);
        },

        renderProgressBar: function (message, currentlyUsedPercent, projectedPercent, overQuotaMessage) {
            var currentlyUsedStyle = {width: currentlyUsedPercent + "%"},
                projectedUsedStyle = {width: projectedPercent + "%", opacity: "0.6"},
                totalPercent = currentlyUsedPercent + projectedPercent,
                barTypeClass;

            if (totalPercent <= 50) {
                barTypeClass = "progress-bar-success";
            } else if (totalPercent <= 100) {
                barTypeClass = "progress-bar-warning";
            } else {
                barTypeClass = "progress-bar-danger";
                projectedUsedStyle.width = (100 - currentlyUsedPercent) + "%";
                message = overQuotaMessage;
            }

            return (
                <div className="allocation-consumption-bar">
                    <div className="progress">
                        <div className="value">{Math.round(currentlyUsedPercent + projectedPercent) + "%"}</div>
                        <div className={"progress-bar " + barTypeClass} style={currentlyUsedStyle}></div>
                        <div className={"progress-bar " + barTypeClass} style={projectedUsedStyle}></div>
                    </div>
                    <div>{message}</div>
                </div>
            );
        },

        focusInput: function() {
          var nameField = this.refs.nameField;
          if(nameField) {
            nameField.getDOMNode().focus();
          }
        },
        renderBody: function () {
            var image = this.props.image,
                identityID,
                identities = stores.IdentityStore.getAll(),
                providers = stores.ProviderStore.getAll(),
                versions = stores.ImageStore.getVersions(image.id);

            if (!providers || !identities || !versions) return <div className="loading"></div>;

            // don't show duplicate images
            versions = this.cleanVersions(versions);
            //Keep things in order
            versions = versions.sort();
            identities = identities.sort();
            if (!this.state.version) {
                this.state.version = versions.last();
            }
            if (!this.state.identity) {
                //NOTE: DO NOT set an identity if no version can be found.
                if(this.state.version) {
                    this.state.identity = identities.first();
                    identityID = this.state.identity.id;
                } else {
                    identityID = -1;
                }
            }

            return (
                <div role='form'>
                    <div className="modal-section form-horizontal">
                        <h4>Basic Information</h4>
                        <div className='form-group'>
                            <label htmlFor='instance-launch-name' className="col-sm-3 control-label">Instance Name</label>
                            <div className="col-sm-9">
                                <input
                                    ref="nameField"
                                    type='text'
                                    className='form-control'
                                    id='instance-launch-name'
                                    value={this.state.name}
                                    onChange={this.onNameChange}
                                />
                            </div>
                        </div>

                        <div className='form-group'>
                            <label htmlFor='machine' className="col-sm-3 control-label">Version</label>
                            <div className="col-sm-9">
                                <VersionSelect
                                    version={this.state.version}
                                    versions={versions}
                                    onChange={this.onVersionChange}
                                />
                            </div>
                        </div>
                        <div className='form-group'>
                            <label htmlFor='identity' className="col-sm-3 control-label">Provider</label>
                            <div className="col-sm-9">
                                <IdentitySelect
                                    identityId={identityID}
                                    identities={identities}
                                    providers={providers}
                                    onChange={this.onIdentityChange}
                                />
                            </div>
                        </div>
                        <div className="modal-section">
                            <h4>Project Allocation Usage</h4>
                            <div className="form-group">
                                {this.renderAllocationConsumption(this.state.identity)}
                            </div>
                            <a href="#" onClick={this.props.onRequestResources}>Need more resources?</a>
                        </div>
                    </div>
                </div>
            );
        },
        render: function () {

            return (
                <div>
                {this.renderBody()}
                    <div className="modal-footer">
                        <button type="button" className="btn btn-default pull-left" onClick={this.onBack}>
                            <span className="glyphicon glyphicon-chevron-left"></span>
                            Back
                        </button>
                        <button type="button" className="btn btn-primary" onClick={this.confirm} disabled={!this.isSubmittable()}>
                            Continue
                        </button>
                    </div>

                </div>
            );
        }

    });

});
