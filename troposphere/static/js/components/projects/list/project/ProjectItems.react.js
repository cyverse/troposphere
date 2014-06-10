/** @jsx React.DOM */

define(
  [
    'react',
    './InstanceProjectItem.react',
    './VolumeProjectItem.react',
    'actions/ProjectActions',
    'backbone',
    'stores/ProjectInstanceStore',
    'stores/ProjectVolumeStore'
  ],
  function (React, InstanceProjectItem, VolumeProjectItem, ProjectActions, Backbone, ProjectInstanceStore, ProjectVolumeStore) {

    function getProjectState(project) {
      return {
        projectInstances: ProjectInstanceStore.getInstancesInProject(project),
        projectVolumes: ProjectVolumeStore.getVolumesInProject(project)
      };
    }

    return React.createClass({

      propTypes: {
        project: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        projects: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      getInitialState: function(){
        return getProjectState(this.props.project);
      },

      componentDidMount: function () {
        ProjectInstanceStore.addChangeListener(this._onChange);
        ProjectVolumeStore.addChangeListener(this._onChange);
      },

      componentDidUnmount: function () {
        ProjectInstanceStore.removeChangeListener(this._onChange);
        ProjectVolumeStore.removeChangeListener(this._onChange);
      },

      _onChange: function(){
        if (this.isMounted()) this.setState(getProjectState(this.props.project));
      },

      confirmDelete: function () {
        ProjectActions.destroy(this.props.project);
      },

      render: function () {

        var self = this;
        var project = this.props.project;
        var projectContainsInstances = this.state.projectInstances && this.state.projectInstances.length !== 0;
        var projectContainsVolumes = this.state.projectVolumes && this.state.projectVolumes.length !== 0;
        var content;

        if (!projectContainsInstances && !projectContainsVolumes){

          var deleteProjectLink = (
            <a href="#" onClick={this.confirmDelete}>
              {"Delete " + project.get('name')}
            </a>
          );

          content = (
            <div>
              <span className='no-project-items'>
                Empty project.
              </span>
              {project.canBeDeleted() ? deleteProjectLink : null}
            </div>
          );

        } else {

          var items = [];

          if(this.state.projectInstances){
            items = items.concat(
              this.state.projectInstances.map(function (instance) {
                return (
                  <InstanceProjectItem
                    key={instance.id}
                    model={instance}
                    projects={self.props.projects}
                    project={project}
                  />
                );
              })
            );
          }

          if(this.state.projectVolumes){
            items = items.concat(
              this.state.projectVolumes.map(function (volume) {
                return (
                  <VolumeProjectItem
                    key={volume.id}
                    model={volume}
                    projects={self.props.projects}
                    project={project}
                  />
                );
              })
            );
          }

          content = (
            <ul className="project-items container-fluid">
              {items}
            </ul>
          );
        }

        return (
          <div className="project-contents">
            {content}
          </div>
        );
      }

    });

  });
