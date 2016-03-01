define(function (require) {

  var React = require('react/addons'),
    Backbone = require('backbone'),
    PreviewPanel = require('./PreviewPanel.react'),
    ButtonBar = require('./ButtonBar.react'),
    ExternalLinkList = require('./link/ExternalLinkList.react'),
    ImageList = require('./image/ImageList.react'),
    InstanceList = require('./instance/InstanceList.react'),
    VolumeList = require('./volume/VolumeList.react'),
    modals = require('modals'),
    stores = require('stores'),
    actions = require('actions'),
    ExternalLink = require('models/ExternalLink');
    Image = require('models/Image'),
    Instance = require('models/Instance'),
    Volume = require('models/Volume');

  return React.createClass({
    displayName: "ProjectDetails",

    propTypes: {
      project: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    getInitialState: function () {
      return {
        previewedResource: null,
        selectedResources: new Backbone.Collection()
      }
    },

    onResourceSelected: function (resource) {
      var selectedResources = this.state.selectedResources;

      // Add the resource to the list of selected resources
      selectedResources.push(resource);

      this.setState({
        previewedResource: resource,
        selectedResources,
      });
    },

    deselectAllResources: function() {
        var selectedResources = this.state.selectedResources;
        selectedResources.reset();
        this.setState({ selectedResources });
    },

    onResourceDeselected: function (resource) {
      var selectedResources = this.state.selectedResources,
          previewedResource = this.state.previewedResource;

      // Remove the resources from the list of selected resources
      selectedResources.remove(resource);

      // Replace preview, with another
      if (previewedResource == resource) {
        previewedResource = selectedResources.last();
      }

      this.setState({
        previewedResource,
        selectedResources,
      });
    },

    onPreviewResource: function () {
        this.deselectAllResources();
    },

    onMoveSelectedResources: function () {
        var attachedResources = stores.VolumeStore.getAttachedResources(),
            anyAttached;

        anyAttached = this.state.selectedResources.some(function(selected) {
            return attachedResources.includes(selected.get('uuid'));
        });

        if (anyAttached){
            modals.ProjectModals.cantMoveAttached();
        } else {
            // On submit of move resources, reset (remove all) from selected collection
            modals.ProjectModals.moveResources(
                this.state.selectedResources,
                this.props.project,
                this.deselectAllResources
            );
        }
    },
    onDeleteSelectedResources: function () {
      actions.ProjectActions.deleteResources(
        this.state.selectedResources,
        this.props.project
      );
    },

    onReportSelectedResources: function () {
      actions.ProjectActions.reportResources(
        this.props.project,
        this.state.selectedResources
      );
    },

    onRemoveSelectedResources: function () {
      modals.ProjectModals.removeResources(
        this.state.selectedResources,
        this.props.project
      );
    },

    render: function () {
      var project = this.props.project,
        projectExternalLinks = stores.ProjectExternalLinkStore.getExternalLinksFor(project),
        projectInstances = stores.ProjectInstanceStore.getInstancesFor(project),
        projectVolumes = stores.ProjectVolumeStore.getVolumesFor(project),
        projectImages = stores.ProjectImageStore.getImagesFor(project),
        previewedResource = this.state.previewedResource,
        selectedResources = this.state.selectedResources,
        selectedResource = this.state.selectedResource,
        isButtonBarVisible;

      if (!projectInstances || !projectImages || !projectExternalLinks || !projectVolumes)
          return <div className="loading"></div>;

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
            previewedResource={previewedResource}
            multipleSelected={selectedResources && selectedResources.length > 1}
            onUnselect={this.onResourceDeselected}
            project={project}
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
              <ImageList
                images={projectImages}
                onResourceSelected={this.onResourceSelected}
                onResourceDeselected={this.onResourceDeselected}
                onPreviewResource={this.onPreviewResource}
                previewedResource={previewedResource}
                selectedResources={selectedResources}
                />
              <ExternalLinkList
                external_links={projectExternalLinks}
                onResourceSelected={this.onResourceSelected}
                onResourceDeselected={this.onResourceDeselected}
                onPreviewResource={this.onPreviewResource}
                previewedResource={previewedResource}
                selectedResources={selectedResources}
                />
            </div>
            <PreviewPanel resource={previewedResource}/>
          </div>
        </div>
      );
    }

  });

});
