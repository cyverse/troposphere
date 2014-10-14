/** @jsx React.DOM */

define(
  [
    'react',
    'stores',
    './detail/details/ProjectDetailsView.react'
  ],
  function (React, stores, ProjectDetailsView) {

    function getState(projectId) {
      return {
        project: stores.ProjectStore.get(projectId)
      };
    }

    return React.createClass({

      //
      // Mounting & State
      // ----------------
      //

      propTypes: {
        projectId: React.PropTypes.string.isRequired
      },

      getInitialState: function() {
        return getState(this.props.projectId);
      },

      updateState: function() {
        if (this.isMounted()) this.setState(getState(this.props.projectId))
      },

      componentDidMount: function () {
        stores.ProjectStore.addChangeListener(this.updateState);
      },

      componentWillUnmount: function () {
        stores.ProjectStore.removeChangeListener(this.updateState);
      },

      //
      // Render
      // ------
      //

      render: function () {
        var project = this.state.project;

        if (project) {
          return (
            <ProjectDetailsView project={project}>
              <div>
                <div className="project-info-segment">
                  <h4>Created</h4>
                  <p>{project.get('start_date').format("MMMM Do, YYYY")}</p>
                </div>
                <div className="project-info-segment">
                  <h4>Description</h4>
                  <p>{project.get('description')}</p>
                </div>
              </div>
            </ProjectDetailsView>
          );
        }

        return (
          <div className="loading"></div>
        );
      }

    });

  });
