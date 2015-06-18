define(function (require) {

  var React = require('react'),
      Backbone = require('backbone'),
      MachineList = require('./MachineList.react');

  return React.createClass({

    propTypes: {
      application: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },
    render: function () {
      var image = this.props.application,
          machines = image.getMachines();
      if(!machines) {
          return (<div className="loading" />);
      }
      //TODO: Why is MachineList failing to accept the 'machines'
      return (
        <div className="image-versions image-info-segment row">
          <h2 className="title col-md-2">Versions</h2>
          <MachineList application={image} machines={machines} editable={true}/>
        </div>
      );
    }

  });

});
