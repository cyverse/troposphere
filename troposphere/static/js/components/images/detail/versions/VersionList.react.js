define(function (require) {

  var React = require('react'),
    _ = require('underscore'),
    Version = require('./Version.react'),
    stores = require('stores'),
    //Modals
    ProviderMachineEditModal = require('components/modals/provider_machine/ProviderMachineEditModal.react'),
    ModalHelpers = require('components/modals/ModalHelpers'),
    actions = require('actions');

  return React.createClass({

      propTypes: {
        image: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        versions: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        editable: React.PropTypes.bool
      },
      //TODO: Next refactor should convert this into 'edit version'
      openEditVersion: function (version) {

        var props = {version: version, image: this.props.image};

        ModalHelpers.renderModal(ProviderMachineEditModal, props, this.onCompletedEdit);

      },
      onCompletedEdit: function (version, end_date, uncopyable, image, licenses, memberships) {
        if (end_date !== null) {
          end_date = new Date(Date.parse(end_date)).toISOString()
        }
        actions.ProviderMachineActions.update(machine, {
          version: version,
          end_date: end_date,
          allow_imaging: uncopyable,
          image: image,
          licenses: licenses,
          memberships: memberships
        });
      },
      //TODO: Next Refactor should remove 'machine' from this equation.
      renderVersion: function (version) {
        return (
          <Version
            key={machine.id}
            version={version}
            image={this.props.image}
            editable={this.props.editable}
            onEditClicked={this.openEditVersion}
            />
        );
      }

      ,

      getMachines: function (versions) {
        var machines = [],
          partialLoad = false;
        //Wait for it...
        if (!versions) {
          return null;
        }
        versions.map(function (version) {
          var _machines = stores.ImageVersionStore.getMachines(version.id);
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
      }
      ,
      removeDuplicateMachines: function (machines) {
        var machineHash = {};

        return machines.filter(function (machine) {
          // remove duplicate machines
          if (!machineHash[machine.id]) {
            machineHash[machine.id] = machine;
            return true;
          }
        });
      }
      ,
      render: function () {
        var versions = _.uniq(this.props.versions.models, function (m) {
          return m.get('uuid');
        });
        return (
          <div className="content col-md-10">
            <ul>
              {versions.map(this.renderVersion)}
            </ul>
          </div>
        );
      }

    }
  )
    ;

})
;
