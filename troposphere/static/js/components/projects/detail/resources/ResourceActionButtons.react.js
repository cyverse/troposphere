define(function (require) {

  var React = require('react'),
      Backbone = require('backbone'),
      Button = require('./Button.react'),
      Instance = require('models/Instance'),
      Volume = require('models/Volume'),
      InstanceActionButtons = require('./InstanceActionButtons.react'),
      VolumeActionButtons = require('./VolumeActionButtons.react');

  return React.createClass({
    displayName: "ResourceActionButtons",

    propTypes: {
      previewedResource: React.PropTypes.instanceOf(Backbone.Model),
      project: React.PropTypes.instanceOf(Backbone.Model),
      volume: React.PropTypes.instanceOf(Backbone.Model),
    },

    render: function () {
      var resource = this.props.previewedResource,
          project = this.props.project;

      if(!resource) return <span/>;

      if (resource instanceof Instance) {
        return (
          <InstanceActionButtons
            onUnselect={this.props.onUnselect}
            instance={resource}
            project={project}
          />
        );
      }else if (resource instanceof Volume){
        return (
          <VolumeActionButtons
            onUnselect={this.props.onUnselect}
            volume={resource}
            project={project}
          />
        );
      }else{
        return <span/>;
      }
    }

  });

});
