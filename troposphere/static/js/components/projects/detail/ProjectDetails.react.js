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
        //projectInstances: ProjectInstanceStore.getInstancesInProject(project),
        projectInstances: InstanceStore.getInstancesInProject(project),
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
        if(this.state.projectInstances && this.state.projectVolumes && this.state.providers) {

          // Figure out which instances are real
          this.state.projectInstances.map(function(projectInstance){
            projectInstance.isRealResource = true;
          });

          // Figure out which volumes are real
          this.state.projectVolumes.map(function(projectVolume){
            projectVolume.isRealResource = true;
          });

          // Only show the action button bar if the user has selected resources
          var isButtonBarVisible = this.state.selectedResources.length > 0;

          return (
            <div className="project-content">
              <ButtonBar isVisible={isButtonBarVisible} onMoveSelectedResources={this.onMoveSelectedResources}/>
              <div className="resource-list">
                <div className="scrollable-content">
                  <InstanceList instances={this.state.projectInstances}
                                project={this.props.project}
                                onResourceSelected={this.onResourceSelected}
                                onResourceDeselected={this.onResourceDeselected}
                                providers={this.state.providers}
                                previewedResource={this.state.previewedResource}
                                selectedResources={this.state.selectedResources}
                  />
                  <VolumeList volumes={this.state.projectVolumes}
                              project={this.props.project}
                              onResourceSelected={this.onResourceSelected}
                              onResourceDeselected={this.onResourceDeselected}
                              providers={this.state.providers}
                              previewedResource={this.state.previewedResource}
                              selectedResources={this.state.selectedResources}
                              instances={this.state.projectInstances}
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
