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
        var project = this.props.project;

        return (
          <option value={project.id}>
            {project.get('name')}
          </option>
        );
      }
    });

  });
