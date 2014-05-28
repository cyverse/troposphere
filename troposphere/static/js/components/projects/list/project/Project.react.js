/** @jsx React.DOM */

define(
  [
    'react',
    './ProjectItems.react',
    './ProjectDescription.react'
  ],
  function (React, ProjectItems, ProjectDescription) {

    return React.createClass({

      propTypes: {
        project: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        projects: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      render: function () {
        var project = this.props.project;

        return (
          <li>
            <h2>{project.get('name')}</h2>
            <a href="#" className="btn btn-primary update-project-btn">+</a>
            <ProjectDescription project={project}/>
            <ProjectItems project={project} projects={this.props.projects}/>
          </li>
        );
      }
    });

  });
