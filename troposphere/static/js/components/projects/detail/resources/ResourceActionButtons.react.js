import React from 'react';
import Backbone from 'backbone';
import Button from './Button.react';
import Instance from 'models/Instance';
import Image from 'models/Image';
import ExternalLink from 'models/ExternalLink';
import Volume from 'models/Volume';
import ImageActionButtons from './ImageActionButtons.react';
import ExternalLinkActionButtons from './ExternalLinkActionButtons.react';
import InstanceActionButtons from './InstanceActionButtons.react';
import VolumeActionButtons from './VolumeActionButtons.react';


export default React.createClass({
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
