/** @jsx React.DOM */

define(
  [
    'react',
    'components/PageHeader.react',
    'modal',
    './ProjectsList.react',
    './NewProjectModal.react'
  ],
  function (React, PageHeader, Modal, ProjectsList, NewProjectModal) {

    return React.createClass({

      helpText: function () {
        return (
          <p>Projects help you organize your cloud resources</p>
        );
      },

      launchNewProjectModal: function () {
        Modal.show(
          <NewProjectModal projects={this.props.projects}/>
        );
      },

      componentDidMount: function () {
        if (!this.props.projects) this.props.onRequestProjects();
      },

      render: function () {
        var content = this.props.projects ?
          <ProjectsList projects={this.props.projects}/> :
          <div className='loading'></div>;

        return (
          <div>
            <PageHeader title="Projects" helpText={this.helpText}/>
            <p>
              <button className='btn btn-primary' onClick={this.launchNewProjectModal}>
              Create Project
              </button>
            </p>
          {content}
          </div>
        );
      }

    });

  });
