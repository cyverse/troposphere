define(function (require) {

  var React = require('react'),
      Backbone = require('backbone'),
      Button = require('./Button.react'),
      actions = require('actions'),
      modals = require('modals');

  return React.createClass({

    propTypes: {
      volume: React.PropTypes.instanceOf(Backbone.Model).isRequired,
      project: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    onAttach: function(){
      modals.InstanceVolumeModals.attach(this.props.volume, this.props.project);
    },

    onDetach: function(){
      modals.InstanceVolumeModals.detach(this.props.volume);
    },

    onDelete: function(){
      modals.VolumeModals.destroy({
        volume: this.props.volume,
        project: this.props.project
      });
    },

    render: function () {
      var volume = this.props.volume,
          status = volume.get('state').get('status'),
          linksArray = [];

      // Add in the conditional links based on current machine state
      if(status === "available"){
        linksArray.push(
          <Button
            key="Attach"
            icon="save"
            tooltip="Attach"
            onClick={this.onAttach}
            isVisible={true}
          />
        );
      }else if(status === "in-use"){
        linksArray.push(
          <Button
            key="Detach"
            icon="open"
            tooltip="Detach"
            onClick={this.onDetach}
            isVisible={true}
          />
        );
      }

      linksArray.push(
        <Button
          key="Delete"
          icon="remove"
          tooltip="Delete"
          onClick={this.onDelete}
          isVisible={true}
        />
      );

      return (
        <div style={{borderLeft: "1px solid #ddd", display: "inline-block", paddingLeft: "10px", float: "right"}}>
          {linksArray}
        </div>
      );
    }

  });

});