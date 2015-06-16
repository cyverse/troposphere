define(function (require) {

    var React = require('react'),
        Backbone = require('backbone'),
        moment = require('moment'),
        Time = require('components/common/Time.react'),
        Gravatar = require('components/common/Gravatar.react'),
        CryptoJS = require('crypto'),
        stores = require('stores'),
        actions = require('actions');

    return React.createClass({

        propTypes: {
            machine: React.PropTypes.instanceOf(Backbone.Model).isRequired,
            application: React.PropTypes.instanceOf(Backbone.Model).isRequired,
            simpleView: React.PropTypes.bool
        },

        handleEditMachineDetails: function () {
            this.showMachineEditModal(this.props.machine);
        },
        //Observation - Should this be in machineList to dictate AT MOST 1?
        showMachineEditModal: function (machine) {
            actions.ProviderMachineActions.edit(machine, this.props.application);
        },


        renderEditLink: function () {
            if (this.props.simpleView == true) {
                return;
            }

            var profile = stores.ProfileStore.get(),
                image = this.props.application;

            if (profile.id && profile.get('username') === image.get('created_by').username) {
                return (
                    <div className="edit-link-row">
                        <a className="edit-link" onClick={this.handleEditMachineDetails}>Edit Version</a>
                    </div>
                )
            }
        },
        renderProvider: function (provider) {
            return (<li>{provider}</li>);
        },
        renderDescription: function (version) {
            if (this.props.simpleView == true) {
                return;
            }
            return (
                <div className="image-version-description">
                    <h3>Description</h3>
            {version.description}
                </div>);
        },
        renderName: function(version) {
            return (
                <span>{version.name}</span>
            )
        },
        renderAvailability: function (image) {
            if (this.props.simpleView == true) {
                return;
            }
            var providers = image.get("machines").map(function (machine) {
                var provider = machine.get("provider");
                return provider.name;
            });
            return (
                <div className="image-version-availability">
                    <h3>Available On</h3>
                    <ul>
                {providers.map(this.renderProvider)}
                    </ul>
                </div>);
        },
        renderExtras: function (version) {
            if (this.props.simpleView == true) {
                return;
            }
            var common_format = "M/DD/YYYY",
                isRecommended = false,
                isActive = version.end_date == null,
                dateCreated = moment(version.start_date),
                dateDestroyed = isActive ? null : moment(version.end_date); // Avoids 'invalid date'

                return (
                <div className="image-version-extras">
                {isRecommended ? <span className="recommended-tag">Recommended</span>
                    : null}
                {isActive ? <span className="recommended-tag">Active</span>
                    : <span>dateDestroyed.format(common_format)</span>}
                </div>
            );
        },
        render: function () {
            // todo: figure out if anything is ever recommended, or if it's just a concept idea
            var common_format = "M/DD/YYYY",
                machine = this.props.machine,
                image = this.props.application,
                isRecommended = false,
                version = machine.get('version'),
                isActive = version.end_date == null,
                dateCreated = moment(version.start_date),
                dateDestroyed = isActive ? null : moment(version.end_date), // Avoid 'invalid date'
                machineHash = CryptoJS.MD5(machine.id.toString()).toString(),
                iconSize = 63,
                type = stores.ProfileStore.get().get('icon_set');

            var createDate = dateCreated.format(common_format);


            return (
                <li>
                    <div>
                        <div className="image-version-header col-md-2">
                            <Gravatar hash={machineHash} size={iconSize} type={type}/>
                            <span>{createDate}</span>
                               {this.renderEditLink()}
                        </div>
                        <div className="image-version-details col-md-10">
                            <div className="version">
                              {this.renderName(version)}
                              {this.renderAvailability(image)}
                              {this.renderDescription(version)}
                              {this.renderExtras(version)}
                            </div>
                        </div>
                    </div>
                </li>
            );
        }

    });

});
