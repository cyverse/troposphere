define(function (require) {

  var React = require('react/addons'),
    Backbone = require('backbone'),
    InstancePreviewView = require('components/projects/resources/instance/preview/InstancePreviewView.react'),
    VolumePreviewView = require('components/projects/resources/volume/preview/VolumePreviewView.react'),
    Instance = require('models/Instance'),
    Volume = require('models/Volume');

  return React.createClass({

    propTypes: {
      resource: React.PropTypes.instanceOf(Backbone.Model)
    },

    render: function () {
      var resource = this.props.resource,
        resourcePreview;

      if (!resource) {
        return (
          <div className="side-panel">
            <div className="preview-message">
              <span className="message">
                Select a resource to see a preview of its details
              </span>
            </div>
          </div>
        );
      }

      if (resource instanceof Instance) {
        resourcePreview = (
          <InstancePreviewView
            key={resource.id}
            instance={resource}
            />
        );
      } else if (resource instanceof Volume) {
        resourcePreview = (
          <VolumePreviewView
            key={resource.id}
            volume={resource}
            />
        );
      }

      return (
        <div className="side-panel">
          <div className="header">
            <span className="title">Details</span>
          </div>
          {resourcePreview}
        </div>
      );
    }

  });

});
