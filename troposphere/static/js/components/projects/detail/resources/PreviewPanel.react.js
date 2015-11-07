import React from 'react/addons';
import Backbone from 'backbone';
import InstancePreviewView from 'components/projects/resources/instance/preview/InstancePreviewView.react';
import VolumePreviewView from 'components/projects/resources/volume/preview/VolumePreviewView.react';
import Instance from 'models/Instance';
import Volume from 'models/Volume';

export default React.createClass({
    displayName: "PreviewPanel",

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
