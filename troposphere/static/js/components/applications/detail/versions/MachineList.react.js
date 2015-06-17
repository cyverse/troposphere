define(function (require) {

  var React = require('react'),
      _ = require('underscore'),
      Machine = require('./Machine.react'),
      stores = require('stores'),
      actions = require('actions');

  return React.createClass({

    propTypes: {
      application: React.PropTypes.instanceOf(Backbone.Model).isRequired,
      machines: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
      editable: React.PropTypes.bool
    },

    renderMachine: function(machine){
      return (
        <Machine
          key={machine.id}
          application={this.props.application}
          machine={machine}
          editable={this.props.editable}
          onEditClicked={this.showMachineEditModal}
        />
      );
    },
     showMachineEditModal: function (machine) {
         actions.ProviderMachineActions.edit(machine, this.props.application);
     },
    render: function () {
      var machines = _.uniq(this.props.machines.models, function(m){
        return m.get('uuid');
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
