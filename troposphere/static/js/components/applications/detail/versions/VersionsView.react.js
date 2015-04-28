define(function (require) {

  var React = require('react'),
      Backbone = require('backbone'),
      MachineList = require('./MachineList.react');

  return React.createClass({

    propTypes: {
      application: React.PropTypes.instanceOf(Backbone.Model).isRequired,
      onEditMachineDetails: React.PropTypes.func.isRequired,
    },

    render: function () {
      var image = this.props.application;

      return (
        <div className="image-versions image-info-segment row">
          <h2 className="title col-md-2">Versions</h2>
          <MachineList application={this.props.application} onEditMachineDetails={this.props.onEditMachineDetails machines={image.get('machines')}/>
        </div>
      );
    }

  });

});
