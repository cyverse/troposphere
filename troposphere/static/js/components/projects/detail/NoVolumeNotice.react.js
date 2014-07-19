/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'actions/VolumeActions'
  ],
  function (React, Backbone, VolumeActions) {

    return React.createClass({

      propTypes: {
        project: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      onCreateVolume: function(e){
        e.preventDefault();
        VolumeActions.createAndAddToProject(this.props.project);
      },

      render: function () {
        return (
          <p>
            You have not added any volumes to this project.
            <a href="#" onClick={this.onCreateVolume}>
              Create a volume.
            </a>
          </p>
        );
      }

    });

  });
