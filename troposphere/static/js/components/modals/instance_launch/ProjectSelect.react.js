
define(
  [
    'react',
    'backbone',
    './ProjectOption.react'
  ],
  function (React, Backbone, ProjectOption) {

    return React.createClass({
      displayName: "ProjectSelect",

      propTypes: {
        projectId: React.PropTypes.number.isRequired,
        projects: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        onChange: React.PropTypes.func.isRequired
      },

      render: function () {
        if (this.props.projects) {
          var options = this.props.projects.map(function (project) {
            return (
              <ProjectOption key={project.id} project={project}/>
            );
          });

          return (
            <select value={this.props.projectId} className='form-control' id='project' onChange={this.props.onChange}>
              {options}
            </select>
          );
        } else {
          return (
            <div className="loading-small"></div>
          );
        }
      }
    });

  });
