/** @jsx React.DOM */

define(
  [
    'react',
    './detail/ProjectResourcesWrapper.react',
    './resources/instance/request_image/RequestImageView.react',
    'stores/ProjectStore'
  ],
  function (React, ProjectResourcesWrapper, RequestImageView, ProjectStore) {

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
            <ProjectResourcesWrapper project={this.state.project}>
              <RequestImageView project={this.state.project} instanceId={this.props.instanceId}/>
            </ProjectResourcesWrapper>
          );
        }

        return (
          <div className="loading"></div>
        );
      }

    });

  });
