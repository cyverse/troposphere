/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    './PreviewPanel.react',
    './ButtonBar.react',
    './instance/InstanceList.react',
    './volume/VolumeList.react',

    'stores',
    'actions',

    // Models
    'models/Instance',
    'models/Volume'
  ],
  function (React, Backbone, PreviewPanel, ButtonBar, InstanceList, VolumeList, stores, actions, Instance, Volume) {

    function getState(project) {
      return {
        projectInstances: stores.ProjectInstanceStore.getInstancesFor(project),
        projectVolumes: stores.ProjectVolumeStore.getVolumesFor(project),
        selectedResource: null,
        previewedResource: null,
        providers: stores.ProviderStore.getAll()
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
          var state = getState(this.props.project);

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
        if(this.state.projectInstances && this.state.projectVolumes && this.state.providers) {

          // Only show the action button bar if the user has selected resources
          var isButtonBarVisible = this.state.selectedResources.length > 0;

          return (
            <div className="project-content">
              <ButtonBar isVisible={isButtonBarVisible}
                         onMoveSelectedResources={this.onMoveSelectedResources}
                         onDeleteSelectedResources={this.onDeleteSelectedResources}
                         onReportSelectedResources={this.onReportSelectedResources}
                         onRemoveSelectedResources={this.onRemoveSelectedResources}
              />
              <div className="resource-list">
                <div className="scrollable-content">
                  <InstanceList instances={this.state.projectInstances}
                                project={this.props.project}
                                onResourceSelected={this.onResourceSelected}
                                onResourceDeselected={this.onResourceDeselected}
                                onPreviewResource={this.onPreviewResource}
                                providers={this.state.providers}
                                previewedResource={this.state.previewedResource}
                                selectedResources={this.state.selectedResources}
                  />
                  <VolumeList volumes={this.state.projectVolumes}
                              project={this.props.project}
                              onResourceSelected={this.onResourceSelected}
                              onResourceDeselected={this.onResourceDeselected}
                              onPreviewResource={this.onPreviewResource}
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
