
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

      updateImages: function () {
        if (this.isMounted()) this.setState(getProjectState());
      },

      componentDidMount: function () {
        stores.ProjectStore.addChangeListener(this.updateImages);
      },

      componentWillUnmount: function () {
        stores.ProjectStore.removeChangeListener(this.updateImages);
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
