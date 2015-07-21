/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    './ProjectList.react',
    'modals',
    'components/projects/common/ProjectListHeader.react',
    'actions'
  ],
  function (React, Backbone, ProjectList, modals, ProjectListHeader, actions) {

    return React.createClass({

      propTypes: {
        projects: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        selectedProject: React.PropTypes.instanceOf(Backbone.Model),
        useRouter: React.PropTypes.bool,
        showCreate: React.PropTypes.bool,
        onProjectClicked: React.PropTypes.func,
        onCreateClicked: React.PropTypes.func,
        onHideClicked: React.PropTypes.func

      },

      createClicked: function () {
        this.props.onCreateClicked(this);
      },
      hideClicked: function () {
        this.props.onHideClicked(this);
      },
      renderCreateButton: function () {
        if (!this.props.showCreate) {
          return (<button
            className='btn btn-primary'
            onClick={this.createClicked}>
            Create New Project
          </button>);
        } else {
          return (<button
            className='btn btn-primary'
            onClick={this.hideClicked}>
            Hide
          </button>);
        }

      },
      render: function () {
        return (
          <div>
            <div className="secondary-nav half-height">
              <div className="modal-section">
                <div className="project-name">
                  <h1>Select or Create a Project</h1>
                  {this.renderCreateButton()}
                </div>
              </div>
            </div>
            <div className="modal-section">
              <ProjectList projects={this.props.projects}
                           selectedProject={this.props.selectedProject}
                           onProjectClicked={this.props.onProjectClicked}
                           useRouter={false}
                />
            </div>
          </div>
        );
      }

    });

  });
