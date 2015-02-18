/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    './MachineList.react'
  ],
  function (React, Backbone, MachineList) {

    return React.createClass({

      propTypes: {
        application: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        identities: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      render: function () {
        var machines = this.props.application.get('machines');
        var machineAliasMap = {};
        var _machines = machines.filter(function(machine){
          if(machineAliasMap[machine.get('alias')]) return false;
          machineAliasMap[machine.get('alias')] = machine;
          return true;
        });
        machines = new machines.constructor(_machines);

        return (
          <div className="image-versions image-info-segment row">
            <h2 className="title col-md-2">Versions</h2>
            <MachineList machines={machines}
                         identities={this.props.identities}
            />
          </div>
        );
      }

    });

  });
