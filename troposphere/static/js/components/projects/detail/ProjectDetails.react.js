/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    './InstanceTable.react',
    './VolumeTable.react',
    './PreviewPanel.react',
    './SubMenu.react',
    './ButtonBar.react',
    'stores/ProjectInstanceStore',
    'stores/ProjectVolumeStore',
    'stores/InstanceStore',
    'stores/VolumeStore'
  ],
  function (React, Backbone, InstanceTable, VolumeTable, PreviewPanel, SubMenu, ButtonBar, ProjectInstanceStore, ProjectVolumeStore, InstanceStore, VolumeStore) {

    function getState(project) {
      return {
        instances: InstanceStore.getAll(),
        volumes: VolumeStore.getAll(),
        projectInstances: ProjectInstanceStore.getInstancesInProject(project),
        projectVolumes: ProjectVolumeStore.getVolumesInProject(project),
        selectedResource: null
      };
    }

    return React.createClass({

      propTypes: {
        project: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      getInitialState: function(){
        return getState(this.props.project);
      },

      componentDidMount: function () {
        InstanceStore.addChangeListener(this.updateState);
        VolumeStore.addChangeListener(this.updateState);
        ProjectInstanceStore.addChangeListener(this.updateState);
        ProjectVolumeStore.addChangeListener(this.updateState);
      },

      componentWillUnmount: function () {
        InstanceStore.removeChangeListener(this.updateState);
        VolumeStore.removeChangeListener(this.updateState);
        ProjectInstanceStore.removeChangeListener(this.updateState);
        ProjectVolumeStore.removeChangeListener(this.updateState);
      },

      updateState: function(){
        if (this.isMounted()) this.setState(getState(this.props.project));
      },

      onResourceSelected: function(resource){
        this.setState({selectedResource: resource});
      },

      render: function () {
        if(this.state.projectInstances && this.state.projectVolumes && this.state.instances && this.state.volumes) {

          // Figure out which instances are real
          var instances = new this.state.instances.constructor();

          this.state.projectInstances.map(function(projectInstance){
            var realInstance = this.state.instances.get(projectInstance.id);
            if(realInstance){
              realInstance.isRealInstance = true;
              instances.push(realInstance);
            }else {
              console.log("Instance " + projectInstance.get('name') + " is not real.");
              projectInstance.isRealInstance = false;
              instances.push(projectInstance);
            }
          }.bind(this));

          // Figure out which volumes are real
          var volumes = new this.state.volumes.constructor();

          this.state.projectVolumes.map(function(projectVolume){
            var realVolume = this.state.volumes.get(projectVolume.id);
            if(realVolume){
              realVolume.isRealVolume = true;
              volumes.push(realVolume);
            }else {
              console.log("Volume " + projectVolume.get('name') + " is not real.");
              projectVolume.isRealVolume = false;
              volumes.push(projectVolume);
            }
          }.bind(this));

          return (
            <div className="project-content">
              <ButtonBar/>
              <div className="resource-list">
                <div className="scrollable-content">
                  <InstanceTable instances={instances} project={this.props.project} onResourceSelected={this.onResourceSelected}/>
                  <VolumeTable volumes={volumes} project={this.props.project} onResourceSelected={this.onResourceSelected}/>
                </div>
                <PreviewPanel resource={this.state.selectedResource}/>
              </div>
            </div>
          );
        }else{
          return (
             <div className="loading"></div>
          );
        }
      }

    });

  });
