define(function (require) {

  var React = require('react'),
      Backbone = require('backbone'),
      MachineList = require('./MachineList.react');

  return React.createClass({

    propTypes: {
      application: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    render: function () {
      var image = this.props.application;
      //TODO: Apply logic in availabilityview here
      return (<div className="loading" />);
        //TODO: Apply 'Consolidate this' ------------------------------------------------------------------------------------------------
        //TODO: Apply 'Consolidate this' ------------------------------------------------------------------------------------------------
      return (
        <div className="image-versions image-info-segment row">
          <h2 className="title col-md-2">Versions</h2>
          <MachineList application={image} machines={image.get('machines')} editable={true}/>
        </div>
      );
    }

  });

});
