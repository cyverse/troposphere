/** @jsx React.DOM */

define(
  [
    'react',
    'backbone'
  ],
  function (React, Backbone) {

    return React.createClass({

      propTypes: {
        project: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      render: function () {
        var projectName = this.props.project.get('name');
        if(projectName === "Default") projectName = "Do not add to a project";
        return (
          <option value={this.props.project.id}>
            {projectName}
          </option>
        );
      }
    });

  });
