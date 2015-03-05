/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'components/projects/resources/instance/preview/InstancePreviewView.react',
    'components/projects/resources/volume/preview/VolumePreviewView.react',

    // Resource Models
    'models/Instance',
    'models/Volume'
  ],
  function (React, Backbone, InstancePreviewView, VolumePreviewView, Instance, Volume) {

    return React.createClass({

      propTypes: {
        project: React.PropTypes.instanceOf(Backbone.Model),
        resource: React.PropTypes.instanceOf(Backbone.Model),
        instances: React.PropTypes.instanceOf(Backbone.Collection)
      },

      render: function () {
        var resource = this.props.resource,
            project = this.props.project,
            
            resourcePreview;

        if(!resource) {
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

        if(resource instanceof Instance) {
          resourcePreview = (
            <InstancePreviewView
              key={resource.id}
              instance={resource}
              project={project}
            />
          );
        } else if(resource instanceof Volume) {
          resourcePreview = (
            <VolumePreviewView
              key={resource.id}
              volume={resource}
              project={project}
              instances={instances}
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
