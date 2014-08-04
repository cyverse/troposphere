/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    '../resources/instance/preview/InstancePreviewView.react',
    '../resources/volume/preview/VolumePreviewView.react',

    // Resource Models
    'models/Instance',
    'models/Volume'
  ],
  function (React, Backbone, InstancePreviewView, VolumePreviewView, Instance, Volume) {

    return React.createClass({

      propTypes: {
        project: React.PropTypes.instanceOf(Backbone.Model),
        resource: React.PropTypes.instanceOf(Backbone.Model)
      },

      render: function () {
        //var resource = new Instance();
        //var resource = new Volume();

        var resourcePreview;

        if(this.props.resource) {
          if (this.props.resource instanceof Instance) {
            resourcePreview = (
              <InstancePreviewView key={this.props.resource.id} instance={this.props.resource} project={this.props.project}/>
            );
          } else if (this.props.resource instanceof Volume) {
            resourcePreview = (
              <VolumePreviewView key={this.props.resource.id} volume={this.props.resource} project={this.props.project}/>
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

        return (
          <div className="side-panel">
          </div>
        );
      }

    });

  });
