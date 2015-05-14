define(function (require) {

  var React = require('react'),
      Backbone = require('backbone'),
      MachineList = require('./MachineList.react'),
      Machine = require('./Machine.react'),
      stores = require('stores');

  return React.createClass({

    propTypes: {
      application: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    render: function () {
      var image = this.props.application,
          machines = stores.ProviderMachineStore.getProviderMachinesFor(image);

      if(!machines) return <div className="loading"/>;

      machines = _.uniq(machines.models, function(machine){
        return machine.get('uuid');
      });

      var first_machine = machines[0]; //Guaranteed one.
      var remaining_machines =  machines.splice(1);


      if (remaining_machines.length == 0) {
          return (
          <div className="image-versions image-info-segment row">
            <h2 className="title col-md-2">Latest Version</h2>
            <ul>
              <Machine application={image} key={first_machine.id} machine={first_machine}/>
            </ul>
          </div>
          );
      } else {
          return (
          <div className="image-versions image-info-segment row">
            <h2 className="title col-md-2">Latest Version</h2>
            <ul>
              <Machine application={image} key={first_machine.id} machine={first_machine}/>
            </ul>
            <h2 className="title col-md-2">Previous Versions</h2>
            <MachineList
                application={image}
                machines={remaining_machines}
            />
          </div>
          );
      }


    }

  });

});
