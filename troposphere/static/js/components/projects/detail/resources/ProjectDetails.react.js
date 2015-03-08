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

    getState: function() {
      var project = this.props.project;

      return {
        projectInstances: stores.ProjectInstanceStore.getInstancesFor(project),
        projectVolumes: stores.ProjectVolumeStore.getVolumesFor(project),
        selectedResource: null,
        previewedResource: null,
        providers: stores.ProviderStore.getAll()
      };
    },

    getInitialState: function(){
      var state = this.getState();
      state.selectedResources = new Backbone.Collection();
      return state;
    },

    componentDidMount: function () {
      stores.InstanceStore.addChangeListener(this.updateState);
      stores.VolumeStore.addChangeListener(this.updateState);
      stores.ProviderStore.addChangeListener(this.updateState);
      stores.SizeStore.addChangeListener(this.updateState);
      stores.ProjectStore.addChangeListener(this.updateState);
      stores.ProjectInstanceStore.addChangeListener(this.updateState);
      stores.ProjectVolumeStore.addChangeListener(this.updateState);
    },

    componentWillUnmount: function () {
      stores.InstanceStore.removeChangeListener(this.updateState);
      stores.VolumeStore.removeChangeListener(this.updateState);
      stores.ProviderStore.removeChangeListener(this.updateState);
      stores.SizeStore.removeChangeListener(this.updateState);
      stores.ProjectStore.removeChangeListener(this.updateState);
      stores.ProjectInstanceStore.removeChangeListener(this.updateState);
      stores.ProjectVolumeStore.removeChangeListener(this.updateState);
    },

    updateState: function(){
      if (this.isMounted()) {
        var state = this.getState();

        // Remove any selected resources that are no longer in the project
        var projectInstances = stores.ProjectInstanceStore.getInstancesFor(this.props.project);
        var projectVolumes = stores.ProjectVolumeStore.getVolumesFor(this.props.project);

        var selectedResourcesClone = this.state.selectedResources.models.slice(0);
        selectedResourcesClone.map(function(selectedResource){
          var instanceInProject = selectedResource instanceof Instance && projectInstances.get(selectedResource);
          var volumeInProject = selectedResource instanceof Volume && projectVolumes.get(selectedResource);
          var resourceInProject = instanceInProject || volumeInProject;
          if(!resourceInProject) this.state.selectedResources.remove(selectedResource);
        }.bind(this));

        // Hold onto selected resource if it still exists
        var indexOfSelectedResource = this.state.selectedResources.indexOf(this.state.selectedResource);
        if(indexOfSelectedResource >= 0) {
          state.selectedResource = this.state.selectedResource;
          state.previewedResource = this.state.previewedResource;
        }

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

    onPreviewResource: function(resource){
      this.state.selectedResources.reset();
      this.state.selectedResources.push(resource);

      this.setState({
        selectedResource: resource,
        previewedResource: resource,
        selectedResources: this.state.selectedResources
      });
    },

    onMoveSelectedResources: function(){
      var selectedResources = this.state.selectedResources;
      actions.ProjectActions.moveResources(selectedResources, this.props.project);
    },

    onDeleteSelectedResources: function(){
      var selectedResources = this.state.selectedResources;
      actions.ProjectActions.deleteResources(selectedResources, this.props.project);
    },

    onReportSelectedResources: function(){
      var selectedResources = this.state.selectedResources;
      actions.ProjectActions.reportResources(this.props.project, selectedResources);
    },

    onRemoveSelectedResources: function(){
      var selectedResources = this.state.selectedResources;
      actions.ProjectActions.removeResources(selectedResources, this.props.project);
    },

    render: function () {
      var projectInstances = this.state.projectInstances,
          projectVolumes = this.state.projectVolumes,
          providers = this.state.providers,
          project = this.props.project,
          previewedResource = this.state.previewedResource,
          selectedResources = this.state.selectedResources,
          selectedResource = this.state.selectedResource,
          isButtonBarVisible;

      if(!projectInstances || !projectVolumes || !providers) return <div className="loading"></div>;

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
                project={project}
                onResourceSelected={this.onResourceSelected}
                onResourceDeselected={this.onResourceDeselected}
                onPreviewResource={this.onPreviewResource}
                providers={providers}
                previewedResource={previewedResource}
                selectedResources={selectedResources}
              />
              <VolumeList
                volumes={projectVolumes}
                project={project}
                onResourceSelected={this.onResourceSelected}
                onResourceDeselected={this.onResourceDeselected}
                onPreviewResource={this.onPreviewResource}
                providers={providers}
                previewedResource={previewedResource}
                selectedResources={selectedResources}
                instances={projectInstances}
              />
            </div>
            <PreviewPanel resource={selectedResource}/>
          </div>
        </div>
      );
    }

  });

});
