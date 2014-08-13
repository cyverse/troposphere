/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    './ProjectList.react',
    '../common/ProjectListHeader.react',
    'actions/ProjectActions'
  ],
  function (React, Backbone, ProjectList, ProjectListHeader, ProjectActions) {

    return React.createClass({

      propTypes: {
        projects: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      launchNewProjectModal: function () {
        ProjectActions.create();
      },

      render: function () {
        return (
          <div>
            <ProjectListHeader title={this.props.projects.length + " Projects"}>
              <button className='btn btn-primary' onClick={this.launchNewProjectModal}>
                Create New Project
              </button>
            </ProjectListHeader>
            <div className="container">
              <ProjectList projects={this.props.projects}/>
            </div>
          </div>
        );
      }

    });

  });
