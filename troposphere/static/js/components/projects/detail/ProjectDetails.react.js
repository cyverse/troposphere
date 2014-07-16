/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    './PreviewPanel.react',
    './ButtonBar.react',
    './InstanceList.react',
    './VolumeList.react',

    // Stores
    'stores/ProjectInstanceStore',
    'stores/ProjectVolumeStore',
    'stores/InstanceStore',
    'stores/VolumeStore',
    'stores/ProviderStore',
    'stores/SizeStore',

    // Actions
    'actions/ProjectActions'
  ],
  function (React, Backbone, PreviewPanel, ButtonBar, InstanceList, VolumeList, ProjectInstanceStore, ProjectVolumeStore, InstanceStore, VolumeStore, ProviderStore, SizeStore, ProjectActions) {

    function getState(project) {
      return {
        instances: InstanceStore.getAll(),
        volumes: VolumeStore.getAll(),
        projectInstances: ProjectInstanceStore.getInstancesInProject(project),
        projectVolumes: ProjectVolumeStore.getVolumesInProject(project),
        selectedResource: null,
        previewedResource: null,
        providers: ProviderStore.getAll()
      };
    }

    return React.createClass({

      propTypes: {
        project: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      getInitialState: function(){
        var state = getState(this.props.project);
        state.selectedResources = new Backbone.Collection();
        return state;
      },

      componentDidMount: function () {
        InstanceStore.addChangeListener(this.updateState);
        VolumeStore.addChangeListener(this.updateState);
        ProjectInstanceStore.addChangeListener(this.updateState);
        ProjectVolumeStore.addChangeListener(this.updateState);
        ProviderStore.addChangeListener(this.updateState);
        SizeStore.addChangeListener(this.updateState);
      },

      componentWillUnmount: function () {
        InstanceStore.removeChangeListener(this.updateState);
        VolumeStore.removeChangeListener(this.updateState);
        ProjectInstanceStore.removeChangeListener(this.updateState);
        ProjectVolumeStore.removeChangeListener(this.updateState);
        ProviderStore.removeChangeListener(this.updateState);
        SizeStore.removeChangeListener(this.updateState);
      },

      updateState: function(){
        if (this.isMounted()) this.setState(getState(this.props.project));
      },

      onResourceSelected: function(resource){
        this.state.selectedResources.push(resource);

        this.setState({
          selectedResource: resource,
          previewedResource: resource,
          selectedResources: this.state.selectedResources
        });
      },

      onResourceDeselected: function(resource){
        this.state.selectedResources.remove(resource);
        var previewedResource = this.state.previewedResource;

        if(previewedResource === resource){
          previewedResource = this.state.selectedResources.last();
        }

        this.setState({
          selectedResource: previewedResource,
          previewedResource: previewedResource,
          selectedResources: this.state.selectedResources
        });
      },

      onMoveSelectedResources: function(){
        var selectedResources = this.state.selectedResources;
        ProjectActions.moveResources(selectedResources, this.props.project);
      },

      render: function () {
        if(this.state.projectInstances && this.state.projectVolumes && this.state.instances && this.state.volumes && this.state.providers) {

          // Figure out which instances are real
          var instances = new this.state.instances.constructor();

          this.state.projectInstances.map(function(projectInstance){
            var realInstance = this.state.instances.get(projectInstance.id);
            if(realInstance){
              realInstance.isRealResource = true;
              instances.push(realInstance);
            }else {
              //console.log("Instance " + projectInstance.get('name') + " is not real.");
              projectInstance.isRealResource = false;
              instances.push(projectInstance);
            }
          }.bind(this));

          // Figure out which volumes are real
          var volumes = new this.state.volumes.constructor();

          this.state.projectVolumes.map(function(projectVolume){
            var realVolume = this.state.volumes.get(projectVolume.id);
            if(realVolume){
              realVolume.isRealResource = true;
              volumes.push(realVolume);
            }else {
              //console.log("Volume " + projectVolume.get('name') + " is not real.");
              projectVolume.isRealResource = false;
              volumes.push(projectVolume);
            }
          }.bind(this));

          // Only show the action button bar if the user has selected resources
          var isButtonBarVisible = this.state.selectedResources.length > 0;

          return (
            <div className="project-content">
              <ButtonBar isVisible={isButtonBarVisible} onMoveSelectedResources={this.onMoveSelectedResources}/>
              <div className="resource-list">
                <div className="scrollable-content">
                  <InstanceList instances={instances}
                                project={this.props.project}
                                onResourceSelected={this.onResourceSelected}
                                onResourceDeselected={this.onResourceDeselected}
                                providers={this.state.providers}
                                previewedResource={this.state.previewedResource}
                                selectedResources={this.state.selectedResources}
                  />
                  <VolumeList volumes={volumes}
                              project={this.props.project}
                              onResourceSelected={this.onResourceSelected}
                              onResourceDeselected={this.onResourceDeselected}
                              providers={this.state.providers}
                              previewedResource={this.state.previewedResource}
                              selectedResources={this.state.selectedResources}
                  />
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
