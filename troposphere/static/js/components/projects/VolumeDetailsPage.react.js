/** @jsx React.DOM */

define(
  [
    'react',
    './volumeDetails/VolumeDetailsView.react',
    'stores/ProjectStore'
  ],
  function (React, VolumeDetailsView, ProjectStore) {

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
        volumeId: React.PropTypes.string.isRequired
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
            <VolumeDetailsView project={this.state.project} volumeId={this.props.volumeId}/>
          );
        } else {
          return (
            <div className="loading"></div>
          );
        }
      }

    });

  });
