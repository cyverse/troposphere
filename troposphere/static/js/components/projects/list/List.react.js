/** @jsx React.DOM */

define(
  [
    'react',
    'components/common/PageHeader.react',
    'modal',
    './ProjectsList.react',
    './NewProjectModal.react'
  ],
  function (React, PageHeader, Modal, ProjectsList, NewProjectModal) {

    return React.createClass({

      propTypes: {
        projects: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      helpText: function () {
        return (
          <p>Projects help you organize your cloud resources</p>
        );
      },

      launchNewProjectModal: function () {
        this.refs.modal.show();
      },

      render: function () {
        return (
          <div>
            <PageHeader title="Projects" helpText={this.helpText}/>
            <p>
              <button className='btn btn-primary' onClick={this.launchNewProjectModal}>
              Create Project
              </button>
            </p>
            <ProjectsList projects={this.props.projects}/>
            <NewProjectModal
              ref="modal"
              show={false}
              header="Example Modal"
              buttons={buttons}
            />
          </div>
        );
      }

    });

  });
