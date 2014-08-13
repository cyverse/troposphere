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
    'stores/InstanceStore',
    'stores/VolumeStore',
    'stores/ProviderStore',
    'stores/SizeStore',
    'stores/ProjectStore',

    // Actions
    'actions/ProjectActions',

    // Models
    'models/Instance',
    'models/Volume'
  ],
  function (React, Backbone, PreviewPanel, ButtonBar, InstanceList, VolumeList, InstanceStore, VolumeStore, ProviderStore, SizeStore, ProjectStore, ProjectActions, Instance, Volume) {

    function getState(project) {
      return {
        projectInstances: InstanceStore.getInstancesInProject(project),
        projectVolumes: VolumeStore.getVolumesInProject(project),
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
        ProviderStore.addChangeListener(this.updateState);
        SizeStore.addChangeListener(this.updateState);
        ProjectStore.addChangeListener(this.updateState);
      },

      componentWillUnmount: function () {
        InstanceStore.removeChangeListener(this.updateState);
        VolumeStore.removeChangeListener(this.updateState);
        ProviderStore.removeChangeListener(this.updateState);
        SizeStore.removeChangeListener(this.updateState);
        ProjectStore.removeChangeListener(this.updateState);
      },

      updateState: function(){
        if (this.isMounted()) {
          var state = getState(this.props.project);

          // Remove any selected resources that are no longer in the project
          var projectInstances = InstanceStore.getInstancesInProject(this.props.project);
          var projectVolumes = VolumeStore.getVolumesInProject(this.props.project);

          var selectedResourcesClone = this.state.selectedResources.models.slice(0);
          selectedResourcesClone.map(function(selectedResource){
            var instanceInProject = selectedResource instanceof Instance && projectInstances.get(selectedResource);
            var volumeInProject = selectedResource instanceof Volume && projectVolumes.get(selectedResource);
            var resourceInProject = instanceInProject || volumeInProject;
            if(!resourceInProject) this.state.selectedResources.remove(selectedResource);
          }.bind(this));

          this.setState(state);
        }
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

      onDeleteSelectedResources: function(){
        var selectedResources = this.state.selectedResources;
        ProjectActions.deleteResources(selectedResources, this.props.project);
      },

      onReportSelectedResources: function(){
        var selectedResources = this.state.selectedResources;
        ProjectActions.reportResources(this.props.project, selectedResources);
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
              <ButtonBar isVisible={isButtonBarVisible}
                         onMoveSelectedResources={this.onMoveSelectedResources}
                         onDeleteSelectedResources={this.onDeleteSelectedResources}
                         onReportSelectedResources={this.onReportSelectedResources}
              />
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
                <PreviewPanel project={this.props.project}
                              resource={this.state.selectedResource}
                              instances={this.state.projectInstances}
                />
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
