/** @jsx React.DOM */

define(
  [
    'react',
    './detail/ProjectResourcesWrapper.react',
    './detail/ProjectDetails.react',
    'stores/ProjectStore',
    'stores/InstanceStore',
    'stores/VolumeStore'
  ],
  function (React, ProjectResourcesWrapper, ProjectDetails, ProjectStore, InstanceStore, VolumeStore) {

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
        projectId: React.PropTypes.string.isRequired
      },

      getInitialState: function() {
        return getState(this.props.projectId);
      },

      updateState: function() {
        if (this.isMounted()) this.setState(getState(this.props.projectId))
      },

      componentDidMount: function () {
        ProjectStore.addChangeListener(this.updateState);
        //InstanceStore.addChangeListener(this.updateState);
        //VolumeStore.addChangeListener(this.updateState);
      },

      componentWillUnmount: function () {
        ProjectStore.removeChangeListener(this.updateState);
        //InstanceStore.removeChangeListener(this.updateState);
        //VolumeStore.removeChangeListener(this.updateState);
      },

      //
      // Render
      // ------
      //

      render: function () {
        if (this.state.project) {
          return (
            <ProjectResourcesWrapper project={this.state.project}>
              <ProjectDetails project={this.state.project}/>
            </ProjectResourcesWrapper>
          );
        }

        return (
          <div className="loading"></div>
        );
      }

    });

  });
