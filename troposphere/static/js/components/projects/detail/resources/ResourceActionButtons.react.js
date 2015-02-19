/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    './Button.react',
    'models/Instance',
    'models/Volume',
    './InstanceActionButtons.react',
    './VolumeActionButtons.react'
  ],
  function (React, Backbone, Button, Instance, Volume, InstanceActionButtons, VolumeActionButtons) {

    return React.createClass({

      propTypes: {
        previewedResource: React.PropTypes.instanceOf(Backbone.Model)
      },

      render: function () {
        var resource = this.props.previewedResource,
            project = this.props.project;

        if(!resource) return <span/>;

        if (resource instanceof Instance) {
          return (
            <InstanceActionButtons
              instance={resource}
              project={project}
            />
          );
        }else if (resource instanceof Volume){
          return (
            <VolumeActionButtons
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
