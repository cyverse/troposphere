define(function (require) {

  var React = require('react/addons'),
    Backbone = require('backbone'),
    Button = require('./Button.react'),
    Instance = require('models/Instance'),
    Image = require('models/Image'),
    ExternalLink = require('models/ExternalLink'),
    Volume = require('models/Volume'),
    ImageActionButtons = require('./ImageActionButtons.react'),
    ExternalLinkActionButtons = require('./ExternalLinkActionButtons.react'),
    InstanceActionButtons = require('./InstanceActionButtons.react'),
    VolumeActionButtons = require('./VolumeActionButtons.react');

  return React.createClass({
    displayName: "ResourceActionButtons",

    propTypes: {
      multipleSelected: React.PropTypes.bool.isRequired,
      previewedResource: React.PropTypes.instanceOf(Backbone.Model),
      project: React.PropTypes.instanceOf(Backbone.Model),
      volume: React.PropTypes.instanceOf(Backbone.Model),
    },

    render: function () {
      var resource = this.props.previewedResource,
        project = this.props.project;

      if (!resource) return <span/>;

      if (resource instanceof Instance) {
        return (
          <InstanceActionButtons
            onUnselect={this.props.onUnselect}
            multipleSelected={this.props.multipleSelected}
            instance={resource}
            project={project}
            />
        );
      } else if (resource instanceof Image) {
        return (
          <ImageActionButtons
            onUnselect={this.props.onUnselect}
            multipleSelected={this.props.multipleSelected}
            image={resource}
            project={project}
            />
        );
      } else if (resource instanceof ExternalLink) {
        return (
          <ExternalLinkActionButtons
            onUnselect={this.props.onUnselect}
            multipleSelected={this.props.multipleSelected}
            external_link={resource}
            project={project}
            />
        );
      } else if (resource instanceof Volume) {
        return (
          <VolumeActionButtons
            onUnselect={this.props.onUnselect}
            multipleSelected={this.props.multipleSelected}
            volume={resource}
            project={project}
            />
        );
      } else {
        return <span/>;
      }
    }

  });

});
