/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    './ProjectList.react',
    '../common/ProjectListHeader.react',
    'actions'
  ],
  function (React, Backbone, ProjectList, ProjectListHeader, actions) {

    return React.createClass({

      propTypes: {
        projects: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      launchNewProjectModal: function () {
        actions.ProjectActions.create();
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
