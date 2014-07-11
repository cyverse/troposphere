/** @jsx React.DOM */

define(
  [
    'react',
    './detail/ProjectDetailsView.react',
    './instanceDetails/InstanceDetailsView.react',
    'stores/ProjectStore'
  ],
  function (React, ProjectDetailsView, InstanceDetailsView, ProjectStore) {

    function getState(projectId) {
      return {
        project: ProjectStore.get(projectId)
      };
    }

    return React.createClass({

      //
      // Mounting & State
      // ----------------
      //

      propTypes: {
        projectId: React.PropTypes.string.isRequired,
        instanceId: React.PropTypes.string.isRequired
      },

      getInitialState: function() {
        return getState(this.props.projectId);
      },

      updateState: function() {
        if (this.isMounted()) this.setState(getState(this.props.projectId))
      },

      componentDidMount: function () {
        ProjectStore.addChangeListener(this.updateState);
      },

      componentWillUnmount: function () {
        ProjectStore.removeChangeListener(this.updateState);
      },

      //
      // Render
      // ------
      //

      render: function () {

        if (this.state.project) {
          return (
            <ProjectDetailsView project={this.state.project}>
              <InstanceDetailsView project={this.state.project} instanceId={this.props.instanceId}/>
            </ProjectDetailsView>
          );
        }

        return (
          <div className="loading"></div>
        );
      }

    });

  });
