define(function (require) {

    var React = require('react'),
        _ = require('underscore'),
        Version = require('./Version.react'),
        stores = require('stores'),
        ProviderMachineCollection = require('collections/ProviderMachineCollection'),
        actions = require('actions');

    return React.createClass({

        propTypes: {
            application: React.PropTypes.instanceOf(Backbone.Model).isRequired,
            versions: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
            editable: React.PropTypes.bool
        },
        //TODO: Next Refactor should remove 'machine' from this equation.
        renderMachine: function (machine) {
            return (
                <Version
                    key={machine.id}
                    application={this.props.application}
                    machine={machine}
                    editable={this.props.editable}
                    onEditClicked={this.showMachineEditModal}
                />
            );
        },
        //TODO: Next refactor should convert this into 'edit version'
        showMachineEditModal: function (machine) {
            actions.ProviderMachineActions.edit(new Backbone.Model(machine), this.props.application);
        },
        getMachines: function (versions) {
            var machines = [],
                partialLoad = false;
            //Wait for it...
            if (!versions) {
                return null;
            }
            versions.map(function (version) {
                var _machines = version.getMachines();
                if (!_machines) {
                    partialLoad = true;
                    return;
                }
                machines = machines.concat(_machines);
            });

            //Don't try to render until you are 100% ready
            if (partialLoad) {
                return null;
            }
            machines = this.removeDuplicateMachines(machines);

            return machines;
        },
        removeDuplicateMachines: function (machines) {
            var machineHash = {};

            return machines.filter(function (machine) {
                // remove duplicate machines
                if (!machineHash[machine.id]) {
                    machineHash[machine.id] = machine;
                    return true;
                }
            });
        },
        render: function () {
            var versions = _.uniq(this.props.versions.models, function (m) {
                return m.get('uuid');
            });
            var allMachines = this.getMachines(this.props.versions.models);
            if (!allMachines) {
                return (<div className="loading" />);
            }

            var machineHash = {},
            machines = allMachines.filter(function (machine) {
                // remove duplicate machines
                if (!machineHash[machine.version.id]) {
                    machineHash[machine.version.id] = machine;
                    return true;
                }
            });
            return (
                <div className="content col-md-10">
                    <ul>
            {machines.map(this.renderMachine)}
                    </ul>
                </div>
            );
        }

    });

});
