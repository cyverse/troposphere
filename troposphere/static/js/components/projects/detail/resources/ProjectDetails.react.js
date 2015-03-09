define(function (require) {

  var React = require('react'),
      Backbone = require('backbone'),
      PreviewPanel = require('./PreviewPanel.react'),
      ButtonBar = require('./ButtonBar.react'),
      InstanceList = require('./instance/InstanceList.react'),
      VolumeList = require('./volume/VolumeList.react'),
      stores = require('stores'),
      actions = require('actions'),
      Instance = require('models/Instance'),
      Volume = require('models/Volume');

  return React.createClass({

    propTypes: {
      project: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    getInitialState: function(){
      return {
        selectedResource: null,
        previewedResource: null,
        selectedResources: new Backbone.Collection()
      }
    },

    updateState: function(){
      var project = this.props.project,
          projectInstances = stores.ProjectInstanceStore.getInstancesFor(project),
          projectVolumes = stores.ProjectVolumeStore.getVolumesFor(project),
          selectedResourcesClone = this.state.selectedResources.models.slice(0),
          state = this.getInitialState();

      if (this.isMounted()) {
        // Remove any selected resources that are no longer in the project
        selectedResourcesClone.map(function(selectedResource){
          var instanceInProject = selectedResource instanceof Instance && projectInstances.get(selectedResource),
              volumeInProject = selectedResource instanceof Volume && projectVolumes.get(selectedResource),
              resourceInProject = instanceInProject || volumeInProject;

          if(resourceInProject) state.selectedResources.add(selectedResource);
        });

        // Hold onto selected resource if it still exists in the project
        if(state.selectedResources.indexOf(this.state.selectedResource) >= 0) {
          state.selectedResource = this.state.selectedResource;
          state.previewedResource = this.state.previewedResource;
        }

        this.setState(state);
      }
    },

    onResourceSelected: function(resource){
      var selectedResources = this.state.selectedResources;

      // Add the resource to the list of selected resources
      selectedResources.push(resource);

      this.setState({
        selectedResource: resource,
        previewedResource: resource,
        selectedResources: selectedResources
      });
    },

    onResourceDeselected: function(resource){
      var selectedResources = this.state.selectedResources,
          previewedResource = this.state.previewedResource;

      // Remove the resources from the list of selected resources
      selectedResources.remove(resource);

      // If the resource is equal to the currently previewed resource, change
      // the previewed resource to the last resource the user selected
      if(previewedResource === resource){
        previewedResource = selectedResources.last();
      }

      this.setState({
        selectedResource: previewedResource,
        previewedResource: previewedResource,
        selectedResources: selectedResources
      });
    },

    onPreviewResource: function(resource){
      var selectedResources = this.state.selectedResources;

      // todo: figure out why I did this...
      selectedResources.reset();
      selectedResources.push(resource);

      this.setState({
        selectedResource: resource,
        previewedResource: resource,
        selectedResources: selectedResources
      });
    },

    onMoveSelectedResources: function(){
      actions.ProjectActions.moveResources(
        this.state.selectedResources,
        this.props.project
      );
    },

    onDeleteSelectedResources: function(){
      actions.ProjectActions.deleteResources(
        this.state.selectedResources,
        this.props.project
      );
    },

    onReportSelectedResources: function(){
      actions.ProjectActions.reportResources(
        this.props.project,
        this.state.selectedResources
      );
    },

    onRemoveSelectedResources: function(){
      actions.ProjectActions.removeResources(
        this.state.selectedResources,
        this.props.project
      );
    },

    render: function () {
      var project = this.props.project,
          projectInstances = stores.ProjectInstanceStore.getInstancesFor(project),
          projectVolumes = stores.ProjectVolumeStore.getVolumesFor(project),
          previewedResource = this.state.previewedResource,
          selectedResources = this.state.selectedResources,
          selectedResource = this.state.selectedResource,
          isButtonBarVisible;

      if(!projectInstances || !projectVolumes) return <div className="loading"></div>;

      // Only show the action button bar if the user has selected resources
      isButtonBarVisible = this.state.selectedResources.length > 0;

      return (
        <div className="project-content">
          <ButtonBar
            isVisible={isButtonBarVisible}
             onMoveSelectedResources={this.onMoveSelectedResources}
             onDeleteSelectedResources={this.onDeleteSelectedResources}
             onReportSelectedResources={this.onReportSelectedResources}
             onRemoveSelectedResources={this.onRemoveSelectedResources}
          />
          <div className="resource-list">
            <div className="scrollable-content">
              <InstanceList
                instances={projectInstances}
                onResourceSelected={this.onResourceSelected}
                onResourceDeselected={this.onResourceDeselected}
                onPreviewResource={this.onPreviewResource}
                previewedResource={previewedResource}
                selectedResources={selectedResources}
              />
              <VolumeList
                volumes={projectVolumes}
                onResourceSelected={this.onResourceSelected}
                onResourceDeselected={this.onResourceDeselected}
                onPreviewResource={this.onPreviewResource}
                previewedResource={previewedResource}
                selectedResources={selectedResources}
              />
            </div>
            <PreviewPanel resource={selectedResource}/>
          </div>
        </div>
      );
    }

  });

});
