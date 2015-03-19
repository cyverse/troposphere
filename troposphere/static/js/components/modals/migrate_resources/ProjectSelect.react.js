/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    './ProjectOption.react'
  ],
  function (React, Backbone, ProjectOption) {

    return React.createClass({

      propTypes: {
        projectId: React.PropTypes.number.isRequired,
        projects: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        onChange: React.PropTypes.func.isRequired
      },

      render: function () {
        var options = this.props.projects.map(function (project) {
          return (
            <ProjectOption key={project.id} project={project}/>
          );
        });

        return (
          <select value={this.props.projectId} className='form-control' id='project' onChange={this.props.onChange}>
            <optgroup label="Projects">
              {options}
            </optgroup>
            <optgroup label="New Project">
              <option value="-1">{"Create new project..."}</option>
            </optgroup>

          </select>
        );
      }
    });

  });
