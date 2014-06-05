/** @jsx React.DOM */

define(
  [
    'react',
    './list/ProjectListView.react',
    'rsvp',
    'stores/projects'
  ],
  function (React, ProjectListView, RSVP, ProjectStore) {

    function getProjectState() {
        return {
          projects: ProjectStore.getAll()
        };
    }

    return React.createClass({

      //
      // Mounting & State
      // ----------------
      //
      getInitialState: function(){
        return getProjectState();
      },

      updateApps: function () {
        if (this.isMounted()) this.setState(getProjectState());
      },

      componentDidMount: function () {
        ProjectStore.addChangeListener(this.updateApps);
      },

      componentDidUnmount: function () {
        ProjectStore.removeChangeListener(this.updateApps);
      },

      //
      // Fetching methods
      // ----------------
      //
      fetchProjects: function(){
        return ProjectController.get();
      },

      //
      // Render
      // ------
      //
      render: function () {
        if (this.state.projects) {
          return (
            <ProjectListView projects={this.state.projects}/>
          );
        } else {
          return (
            <div className="loading"></div>
          );
        }
      }

    });

  });
