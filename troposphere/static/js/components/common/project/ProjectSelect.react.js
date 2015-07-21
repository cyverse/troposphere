/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'stores',
    './ProjectOption.react'
  ],
  function (React, Backbone, stores, ProjectOption) {

    return React.createClass({

      propTypes: {
        projectId: React.PropTypes.number.isRequired,
        projects: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        onChange: React.PropTypes.func.isRequired,
        showCreate: React.PropTypes.bool,
      },
      getInitialState: function () {
        var showCreate = false;
        if (this.props.showCreate == true) {
          showCreate = true
        }
        return {
          showCreate: showCreate,
        }
      },
      componentDidMount: function () {
        stores.ProjectStore.addChangeListener(this.updateState);
      },

      componentWillUnmount: function () {
        stores.ProjectStore.removeChangeListener(this.updateState);
      },
      renderCreateOption: function () {
        if (this.state.showCreate) {
          return (
            <optgroup label="New Project">
              <option value="-1">{"Create new project..."}</option>
            </optgroup>);
        }
      },
      render: function () {
        var projects = this.props.projects;
        var options = projects.map(function (project) {
          return (
            <ProjectOption key={project.id} project={project}/>
          );
        });

        if (projects == null) return (<div className="loading"></div>);

        return (
          <div>
            <select value={this.props.projectId} className='form-control' id='project' onChange={this.props.onChange}>
              <optgroup label="Projects">
                {options}
              </optgroup>

              {this.renderCreateOption()}
            </select>
          </div>
        );
      }
    });

  });
