/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    '../resources/instance/preview/InstancePreviewView.react'
  ],
  function (React, Backbone, InstancePreviewView) {

    return React.createClass({

      propTypes: {
        project: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      render: function () {
        var resourcePreview;
        if(true){
          resourcePreview = (
            <InstancePreviewView/>
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
