/** @jsx React.DOM */

define(
  [
    'react',
    './list/List.react',
    'rsvp',
    'controllers/projects'
  ],
  function (React, ProjectListView, RSVP, ProjectController) {

    return React.createClass({

      //
      // Mounting & State
      // ----------------
      //
      getInitialState: function(){
        return {};
      },

      componentDidMount: function () {
        RSVP.hash({
          projects: this.fetchProjects()
        })
        .then(function (results) {
          this.setState({
            projects: results.projects
          })
        }.bind(this));
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
