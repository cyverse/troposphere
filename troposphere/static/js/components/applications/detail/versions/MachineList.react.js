/** @jsx React.DOM */

define(
  [
    'react',
    './Machine.react',
    'stores/MachineStore'
  ],
  function (React, Machine, MachineStore) {

    return React.createClass({

      propTypes: {
        machines: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        identities: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      render: function () {
        var versions = this.props.machines.map(function (m) {
          var providerId = m.get('provider');
          var identityId = this.props.identities.findWhere({provider_id: providerId}).id;
          var machine = MachineStore.get(providerId, identityId, m.id);

          // todo: at the time of this writing, there are multiple machines with the same alias/id.
          // Because of that (and because we're displaying all the machines) we need to create an id
          // that is unique for each machine. That is why the key is the id + the providerId.
          if(machine){
            return (
              <Machine key={m.id + providerId} machine={machine}/>
            );
          }else{
            return (
              <div key={m.id + providerId} className="loading"></div>
            );
          }
        }.bind(this));

        return (
          <ul>{versions}</ul>
        );
      }

    });

  });
