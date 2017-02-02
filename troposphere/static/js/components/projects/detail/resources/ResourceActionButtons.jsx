import React from "react";
import Backbone from "backbone";

import Instance from "models/Instance";
import Image from "models/Image";
import ExternalLink from "models/ExternalLink";
import Volume from "models/Volume";

import ImageActionButtons from "./ImageActionButtons";
import ExternalLinkActionButtons from "./ExternalLinkActionButtons";
import InstanceActionButtons from "./InstanceActionButtons";
import InstanceBatchActionButtons from "./InstanceBatchActionButtons";
import VolumeActionButtons from "./VolumeActionButtons";

import features from "utilities/featureFlags";


/**
 * Decides the component rendered based on "feature flag"
 *
 * During the evaluation period of this work, we will use
 * a simple "flag" to decide if the "actions" component
 * supports "bulk" (aka _batch_) operations over resources,
 * specifically Instances to begin with.
 *
 * Relates to: ATMO-981
 */
function selectInstanceActionButtons(props) {
    let {
        onUnselect,
        onUnselectAll,
        multipleSelected,
        selectedResources,
        previewedResource,
        project } = props;

    if (features.BATCH_RESOURCE_ACTIONS) {
        return (
            <InstanceBatchActionButtons
                onUnselect={onUnselect}
                onUnselectAll={onUnselectAll}
                multipleSelected={multipleSelected}
                selectedResources={selectedResources}
                instance={previewedResource}
                project={project} />
        );
    } else {
        return (
            <InstanceActionButtons
                onUnselect={onUnselect}
                multipleSelected={multipleSelected}
                selectedResources={selectedResources}
                instance={previewedResource}
                project={project} />
        );
    }
}


export default React.createClass({
    displayName: "ResourceActionButtons",

    propTypes: {
        multipleSelected: React.PropTypes.bool.isRequired,
        previewedResource: React.PropTypes.instanceOf(Backbone.Model),
        selectedResources: React.PropTypes.instanceOf(Backbone.Collection),
        onUnselect: React.PropTypes.func.isRequired,
        onUnselectAll: React.PropTypes.func,
        project: React.PropTypes.instanceOf(Backbone.Model),
        volume: React.PropTypes.instanceOf(Backbone.Model),
    },

    render: function() {
        let resource = this.props.previewedResource,
            project = this.props.project;

        if (!resource) return <span/>;

        if (resource instanceof Instance) {
            return selectInstanceActionButtons(this.props);
        } else if (resource instanceof Image) {
            return (
            <ImageActionButtons onUnselect={this.props.onUnselect}
                multipleSelected={this.props.multipleSelected}
                image={resource}
                project={project} />
            );
        } else if (resource instanceof ExternalLink) {
            return (
            <ExternalLinkActionButtons onUnselect={this.props.onUnselect}
                multipleSelected={this.props.multipleSelected}
                external_link={resource}
                project={project} />
            );
        } else if (resource instanceof Volume) {
            return (
            <VolumeActionButtons onUnselect={this.props.onUnselect}
                multipleSelected={this.props.multipleSelected}
                volume={resource}
                project={project} />
            );
        } else {
            return <span/>;
        }
    }

});
