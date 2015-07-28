
define(
  [
    'react',
    './list/ProjectListView.react',
    'stores'
  ],
  function (React, ProjectListView, stores) {

    function getProjectState() {
      return {
        projects: stores.ProjectStore.getAll()
      };
    }

    return React.createClass({

      //
      // Mounting & State
      // ----------------
      //
      getInitialState: function () {
        return getProjectState();
      },

      updateApps: function () {
        if (this.isMounted()) this.setState(getProjectState());
      },

      componentDidMount: function () {
        stores.ProjectStore.addChangeListener(this.updateApps);
      },

      componentWillUnmount: function () {
        stores.ProjectStore.removeChangeListener(this.updateApps);
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
