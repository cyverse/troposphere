/** @jsx React.DOM */

define(
  [
    'react',
    './project/Project.react',
    'backbone'
  ],
  function (React, Project, Backbone) {

    return React.createClass({

      propTypes: {
        projects: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      render: function () {
        var projects = this.props.projects.map(function (model) {
          return (
            <Project key={model.id} project={model} projects={this.props.projects}/>
          );
        }.bind(this));

        return (
          <ul id="project-list">
            {projects}
          </ul>
        );
      }
    });

  });
