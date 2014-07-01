/** @jsx React.DOM */

define(
  [
    'react',
    './ProjectItems.react',
    './ProjectDescription.react',
    'backbone',
    'actions/ProjectActions'
  ],
  function (React, ProjectItems, ProjectDescription, Backbone, ProjectActions) {

    return React.createClass({

      propTypes: {
        project: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        projects: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      onAddResourceToProject: function(e){
        e.preventDefault();
        ProjectActions.addResourceToProject(this.props.project);
      },

      render: function () {
        var project = this.props.project;

        if(project.id){
          return (
            <li>
              <h2>{project.get('name')}</h2>
              <a href="#" className="btn btn-primary update-project-btn" onClick={this.onAddResourceToProject}>+</a>
              <ProjectDescription project={project}/>
              <ProjectItems project={project} projects={this.props.projects}/>
            </li>
          );

        }else{
          return (
            <li>
              <h2>{project.get('name')} ...creating project...</h2>
              <div className="project-description">
                <p>{project.get('description')}</p>
              </div>
            </li>
          );
        }

      }
    });

  });
