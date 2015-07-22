/** @jsx React.DOM */

define(
  [
    'react',
    './Project.react',
    'backbone'
  ],
  function (React, Project, Backbone) {

    return React.createClass({

      propTypes: {
        projects: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        selectedProject: React.PropTypes.instanceOf(Backbone.Model),
        useRouter: React.PropTypes.bool,
        onProjectClicked: React.PropTypes.func
      },
      projectClicked: function (project) {
        return this.props.onProjectClicked(project);
      },
      render: function () {
        var self = this,
          projects = this.props.projects.map(function (project) {
            var className;
            if (this.props.selectedProject && this.props.selectedProject == project) {
              className = "active"
            } else {
              className = ""
            }
            return (
              <Project key={project.id || project.cid} project={project} projects={this.props.projects}
                       onClick={self.projectClicked} useRouter={this.props.useRouter} className={className}/>
            );
          }.bind(this));

        return (
          <ul id="project-list">
            {projects}
          </ul>
        );
      }
    });

  });
