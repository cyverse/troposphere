/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'components/mixins/BootstrapModalMixin.react',
    'stores',
    '../instance_launch/ProjectSelect.react'
  ],
  function (React, Backbone, BootstrapModalMixin, stores, ProjectSelect) {

    function getState(currentProject, currentState) {
      var state = {
        projects: stores.ProjectStore.getAll(),
        projectId: null
      };

      // Use selected project or default to the null one
      if (state.projects) {
        state.projects = state.projects.clone();
        state.projects.remove(currentProject);

        // todo: Account for the scenario when the only project is the current one
        // and the length of projects will now be zero
        if (state.projects.models.length > 0) {
          state.projectId = currentState.projectId || state.projects.first().id;
        }
      }

      return state;
    }

    return React.createClass({
      mixins: [BootstrapModalMixin],

      propTypes: {
        currentProject: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        resources: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      isSubmittable: function () {
        var hasProject = !!this.state.projectId;
        return hasProject;
      },

      //
      // Mounting & State
      // ----------------
      //

      getInitialState: function () {
        return getState(this.props.currentProject, this.state || {});
      },

      updateState: function () {
        if (this.isMounted()) this.setState(getState(this.props.currentProject, this.state || {}));
      },

      componentDidMount: function () {
        stores.ProjectStore.addChangeListener(this.updateState);
      },

      componentWillUnmount: function () {
        stores.ProjectStore.removeChangeListener(this.updateState);
      },

      //
      // Internal Modal Callbacks
      // ------------------------
      //

      cancel: function () {
        this.hide();
      },

      confirm: function () {
        this.hide();
        var project = this.state.projects.get(this.state.projectId);
        this.props.onConfirm(project);
      },


      //
      // Custom Modal Callbacks
      // ----------------------
      //

      onProjectChange: function (e) {
        var newProjectId = e.target.value;
        this.setState({projectId: newProjectId});
      },


      //
      // Render
      // ------
      //

      renderResource: function (resource) {
        return (
          <li key={resource.id}>{resource.get('name')}</li>
        );
      },

      renderBody: function () {
        if (this.state.projects) {
          if (this.state.projects.models.length > 0) {
            return (
              <div role='form'>

                <div className='form-group'>
                  <label htmlFor='volumeSize'>Resources to Move</label>

                  <p>The following resources will be moved to the selected project</p>
                  <ul>
                    {this.props.resources.map(this.renderResource)}
                  </ul>
                </div>

                <div className='form-group'>
                  <label htmlFor='project'>Project</label>
                  <ProjectSelect
                    projectId={this.state.projectId}
                    projects={this.state.projects}
                    onChange={this.onProjectChange}
                    />
                </div>

              </div>
            );
          } else {
            return (
              <div role='form'>

                <div className='form-group'>
                  <p>Looks like you only have one project.</p>

                  <p>In order to move resources between projects, you will first need to create a second project.</p>
                </div>

              </div>
            );
          }
        }

        return (
          <div className="loading"></div>
        );
      },

      render: function () {
        // todo: If the user only has one project, provide an action to create another project

        return (
          <div className="modal fade">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  {this.renderCloseButton()}
                  <strong>Move Resources</strong>
                </div>
                <div className="modal-body">
                  {this.renderBody()}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-danger" onClick={this.cancel}>
                    Cancel
                  </button>
                  <button type="button" className="btn btn-primary" onClick={this.confirm}
                          disabled={!this.isSubmittable()}>
                    Move resources
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      }

    });

  });
