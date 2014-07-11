/** @jsx React.DOM */

define(
  [
    'react',
    'modal',
    './ProjectList.react',
    './NewProjectModal.react',
    'backbone',
    '../common/ProjectListHeader.react'
  ],
  function (React, Modal, ProjectList, NewProjectModal, Backbone, ProjectListHeader) {

    return React.createClass({

      propTypes: {
        projects: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      launchNewProjectModal: function () {
        this.refs.modal.show();
      },

      render: function () {
        return (
          <div>
            <ProjectListHeader title={this.props.projects.length + " Projects"}>
              <button className='btn btn-primary' >
                Create Project
              </button>
            </ProjectListHeader>
            <div className="container">
              <ProjectList projects={this.props.projects}/>
              <NewProjectModal ref="modal"/>
            </div>
          </div>
        );
      }

    });

  });
