/** @jsx React.DOM */

define(
  [
    'react',
    './detail/ProjectDetailsView.react',
    './detail/ProjectDetails.react',
    'stores'
  ],
  function (React, ProjectDetailsView, ProjectDetails, stores) {

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
        if (this.state.project) {
          return (
            <ProjectDetailsView project={this.state.project}>
              <h3>Details for project {this.state.project.get('name')}</h3>
            </ProjectDetailsView>
          );
        }

        return (
          <div className="loading"></div>
        );
      }

    });

  });
