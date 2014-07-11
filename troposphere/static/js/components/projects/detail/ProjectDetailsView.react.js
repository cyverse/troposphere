/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    './ProjectNavigation.react',
    './ProjectDetails.react'
  ],
  function (React, Backbone, ProjectNavigation, ProjectDetails) {

    return React.createClass({

      propTypes: {
        project: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      render: function () {
        return (
          <div className="project-details">
            <ProjectNavigation project={this.props.project}/>
            <ProjectDetails/>
          </div>
        );
      }

    });

  });
