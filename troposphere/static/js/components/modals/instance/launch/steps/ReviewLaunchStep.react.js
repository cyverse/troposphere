define(function (require) {

    var React = require('react'),
        Backbone = require('backbone'),
        _ = require('underscore'),
        stores = require('stores'),
        VersionList = require('components/images/detail/versions/VersionList.react'),
        VersionCollection = require('collections/ImageVersionCollection'),
        Glyphicon = require('components/common/Glyphicon.react');

    var ENTER_KEY = 13;

    return React.createClass({
      displayName: "ReviewLaunchStep",

      propTypes: {
            //name: React.PropTypes.string.isRequired,
            //image: React.PropTypes.instanceOf(Backbone.Model).isRequired,
            //version: React.PropTypes.instanceOf(Backbone.Model).isRequired,
            //size: React.PropTypes.instanceOf(Backbone.Model).isRequired,
            //identity: React.PropTypes.instanceOf(Backbone.Model).isRequired,
            //project: React.PropTypes.instanceOf(Backbone.Model).isRequired,
            launchData: React.PropTypes.object.isRequired,
            onPrevious: React.PropTypes.func.isRequired,
            onNext: React.PropTypes.func.isRequired
        },

        getInitialState: function () {
            var state = this.props.launchData;
            return state;
        },
        isSubmittable: function () {
            var maintenanceMessages = stores.MaintenanceMessageStore.getAll(),
                isProviderInMaintenance;

            if (!maintenanceMessages) return false;

            // Make sure the selected provider is not in maintenance
            isProviderInMaintenance = stores.MaintenanceMessageStore.isProviderInMaintenance(
                this.state.identity.get('provider').id);

            var providerNotInMaintenance = !isProviderInMaintenance;

            return (
                providerNotInMaintenance
            );
        },
        confirm: function () {
            this.props.onNext(this.state);
        },

        renderAllocationWarning: function (identity) {
            if (!this.hasAvailableAllocation(identity)) {
                return (
                    <div className="alert alert-danger">
                        <Glyphicon name='warning-sign'/>
                        <strong>{"Uh oh!"}</strong>
            {
            " Looks like you don't have any AUs available.  In order to launch instances, you need " +
            "to have AUs free.  You will be able to launch again once your AUs have been reset."
                }
                    </div>
                );
            }
        },

        renderProgressBar: function (message, currentlyUsedPercent, projectedPercent, overQuotaMessage, mainClassName) {
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
            if (!mainClassName) {
                mainClassName = "quota-consumption-bars";
            }

            return (
                <div className={mainClassName}>
                    <div className="progress">
                        <div className="value">{Math.round(currentlyUsedPercent + projectedPercent) + "%"}</div>
                        <div className={"progress-bar " + barTypeClass} style={currentlyUsedStyle}></div>
                        <div className={"progress-bar " + barTypeClass} style={projectedUsedStyle}></div>
                    </div>
                    <div>{message}</div>
                </div>
            );
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

            return this.renderProgressBar(message, currentlyUsedPercent, 0, overQuotaMessage, "allocation-consumption-bar");
        },
        renderCpuConsumption: function (identity, size, sizes, instances) {
            var quota = identity.get('quota'),
                maximumAllowed = quota.cpu,
                projected = size.get('cpu'),
                currentlyUsed = identity.getCpusUsed(instances, sizes),
            // convert to percentages
                projectedPercent = projected / maximumAllowed * 100,
                currentlyUsedPercent = currentlyUsed / maximumAllowed * 100,
                message = (
                "You will use " + (Math.round(currentlyUsed + projected)) + " of " + maximumAllowed + " allotted CPUs."
                ),
                overQuotaMessage = (
                    <div>
                        <strong>CPU quota exceeded.</strong>
                        <span>{" Choose a smaller size or terminate a running instance."}</span>
                    </div>
                );

            return this.renderProgressBar(message, currentlyUsedPercent, projectedPercent, overQuotaMessage);
        },

        renderMemoryConsumption: function (identity, size, sizes, instances) {
            var quota = identity.get('quota'),
                maximumAllowed = quota.memory,
                projected = size.get('mem'),
                currentlyUsed = identity.getMemoryUsed(instances, sizes),
            // convert to percentages
                projectedPercent = projected / maximumAllowed * 100,
                currentlyUsedPercent = currentlyUsed / maximumAllowed * 100,
                message = (
                "You will use " + (Math.round(currentlyUsed + projected)) + " of " + maximumAllowed + " allotted GBs of Memory."
                ),
                overQuotaMessage = (
                    <div>
                        <strong>Memory quota exceeded.</strong>
                        <span>{" Choose a smaller size or terminate a running instance."}</span>
                    </div>
                );

            return this.renderProgressBar(message, currentlyUsedPercent, projectedPercent, overQuotaMessage);
        },
        renderBody: function () {
            var identity = this.state.identity,
                size = this.state.size,
                instances = stores.InstanceStore.getAll(),
                sizes = stores.SizeStore.getAll(),
                versions = new VersionCollection([this.state.version]);

            return (
                <div role='form'>


                    <div className="modal-section form-horizontal">
                        <h4>Review Launch Details</h4>

                        <h5>Basic Information</h5>
                        <div className='form-group'>
                            <label htmlFor='instance-name' className="col-sm-3 control-label">Instance Name</label>
                            <div className="col-sm-9">

                                <input
                                    type='text'
                                    className='form-control'
                                    id='instance-name'
                                    value={this.state.name}
                                    readOnly
                                />
                            </div>
                        </div>

                        <div className='form-group'>
                            <label htmlFor='machine' className="col-sm-3 control-label">Version</label>
                            <div className="col-sm-9 image-versions image-info-segment row">
                              <VersionList image={this.state.image} versions={versions} editable={false} showAvailability={false} readOnly />
                            </div>
                        </div>
                        <h5>Resources</h5>
                        <div className='form-group'>
                            <label htmlFor='identity' className="col-sm-3 control-label">Provider</label>
                            <div className="col-sm-9">
                                <input
                                    type='text'
                                    className='form-control'
                                    id='identity'
                                    value={this.state.identity.get('provider').name}
                                    readOnly
                                />
                            </div>
                        </div>

                        <div className='form-group'>
                            <label htmlFor='size' className="col-sm-3 control-label">Size</label>
                            <div className="col-sm-9">
                                <input
                                    type='text'
                                    className='form-control'
                                    id='size'
                                    value={this.state.size.formattedDetails()}
                                    readOnly
                                />
                            </div>
                        </div>

                        <div className='form-group'>
                            <label htmlFor='project' className="col-sm-3 control-label">Project</label>
                            <div className="col-sm-9">
                                <input
                                    type='text'
                                    className='form-control'
                                    id='project'
                                    value={this.state.project.get('name')}
                                    readOnly
                                />
                            </div>
                        </div>

                        <div className='form-group' className="modal-section">
                            <h4>Projected Resource Usage</h4>
                            {this.renderCpuConsumption(identity, size, sizes, instances)}
                            {this.renderMemoryConsumption(identity, size, sizes, instances)}
                            <h4>Current Allocation Usage</h4>
                            {this.renderAllocationConsumption(identity)}
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
                        <button type="button" className="btn btn-default pull-left" onClick={this.props.onPrevious}>
                            <span className="glyphicon glyphicon-chevron-left"></span>
                            Back
                        </button>
                        <button type="button" className="btn btn-primary" onClick={this.confirm} disabled={!this.isSubmittable()}>
                            Launch Instance
                        </button>
                    </div>

                </div>
            );
        }
    });
});
