/** @jsx React.DOM */

define(
  [
    'react',
    'components/common/PageHeader.react',
    'modal',
    './ProjectList.react',
    './NewProjectModal.react',
    'backbone'
  ],
  function (React, PageHeader, Modal, ProjectList, NewProjectModal, Backbone) {

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
          <div className="container">
            <PageHeader title="Projects" helpText={this.helpText}/>
            <p>
              <button className='btn btn-primary' onClick={this.launchNewProjectModal}>
              Create Project
              </button>
            </p>
            <ProjectList projects={this.props.projects}/>
            <NewProjectModal ref="modal"/>
          </div>
        );
      }

    });

  });
