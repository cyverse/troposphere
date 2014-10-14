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

      onDescriptionChanged: function(text){
        ProjectActions.updateProjectAttributes(this.props.project, {description: text});
      },

      //
      // Render
      // ------
      //

      render: function () {
        var project = this.state.project;

        if (project) {
          return (
            <ProjectDetailsView project={project}/>
          );
        }

        return (
          <div className="loading"></div>
        );
      }

    });

  });
