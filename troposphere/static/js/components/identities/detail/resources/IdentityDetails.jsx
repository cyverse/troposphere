import React from "react";
import Backbone from "backbone";
//FIXME: these imports shouldnt _require_ using ../../
import ButtonBar from "../../../projects/detail/resources/ButtonBar";
import InstanceList from "../../../projects/detail/resources/instance/InstanceList";
import VolumeList from "../../../projects/detail/resources/volume/VolumeList";
import modals from "modals";
import stores from "stores";
import actions from "actions";


export default React.createClass({
    displayName: "IdentityDetails",

    propTypes: {
        identity: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    getInitialState: function() {
        return {
            previewedResource: null,
            selectedResources: new Backbone.Collection()
        }
    },

    updateState: function() {
        let identity = this.props.identity;
        let volumes = stores.VolumeStore.getVolumesForIdentity(identity);
        let instances = stores.InstanceStore.getInstancesForIdentity(identity);
        let selectedResources = this.state.selectedResources;


        if (instances && volumes) {

            // Take into account that selected resources may be out of date, that
            // it may contain resources that no longer exist in the endpoints
            let selectedThatStillExist = selectedResources.cfilter(r => {
                return  instances.contains(r) ||
                        volumes.contains(r);
            });

            this.setState({
                selectedResources: selectedThatStillExist
            });
        }

        this.forceUpdate();
    },

    componentDidMount: function() {
        stores.VolumeStore.addChangeListener(this.updateState);
        stores.InstanceStore.addChangeListener(this.updateState);
    },

    componentWillUnmount: function() {
        stores.InstanceStore.removeChangeListener(this.updateState);
        stores.VolumeStore.removeChangeListener(this.updateState);
    },

    onResourceSelected: function(resource) {
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
        this.setState({
            selectedResources
        });
    },

    onResourceDeselected: function(resource) {
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

    onPreviewResource: function() {
        this.deselectAllResources();
    },

    onDeleteSelectedResources: function() {
        actions.IdentityActions.deleteResources(
            this.state.selectedResources,
            this.props.identity
        );
    },

    onReportSelectedResources: function() {
        actions.IdentityActions.reportResources(
            this.props.identity,
            this.state.selectedResources
        );
    },

    onRemoveSelectedResources: function() {
        modals.IdentityModals.removeResources(
            this.state.selectedResources,
            this.props.identity
        );
    },

    render: function() {
        var identity = this.props.identity,
            identityVolumes = stores.VolumeStore.getVolumesForIdentity(identity),
            identityInstances = stores.InstanceStore.getInstancesForIdentity(identity),
            previewedResource = this.state.previewedResource,
            selectedResources = this.state.selectedResources,
            isButtonBarVisible;

        if (!identityInstances || !identityVolumes)
            return <div className="loading"></div>;

        // Only show the action button bar if the user has selected resources
        isButtonBarVisible = this.state.selectedResources.length > 0;

        return (
        <div className="identity-content clearfix">
            <ButtonBar isVisible={isButtonBarVisible}
                onDeleteSelectedResources={this.onDeleteSelectedResources}
                onReportSelectedResources={this.onReportSelectedResources}
                onRemoveSelectedResources={this.onRemoveSelectedResources}
                previewedResource={previewedResource}
                multipleSelected={selectedResources && selectedResources.length > 1}
                onUnselect={this.onResourceDeselected}
                identity={identity} />
            <div className="resource-list clearfix">
                <div className="scrollable-content" style={{ borderTop: "solid 1px #E1E1E1" }}>
                    <InstanceList instances={identityInstances}
                        onResourceSelected={this.onResourceSelected}
                        onResourceDeselected={this.onResourceDeselected}
                        onPreviewResource={this.onPreviewResource}
                        previewedResource={previewedResource}
                        selectedResources={selectedResources} />
                    <VolumeList volumes={identityVolumes}
                        onResourceSelected={this.onResourceSelected}
                        onResourceDeselected={this.onResourceDeselected}
                        onPreviewResource={this.onPreviewResource}
                        previewedResource={previewedResource}
                        selectedResources={selectedResources} />
                </div>
            </div>
        </div>
        );
    }
});
