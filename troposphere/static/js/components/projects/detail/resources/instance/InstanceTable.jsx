import React from "react";
import Backbone from "backbone";
import InstanceRow from "./InstanceRow";
import SelectableTable from "../SelectableTable";

import featureFlags from "utilities/featureFlags";


export default React.createClass({
    displayName: "InstanceTable",

    propTypes: {
        instances: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        onResourceSelected: React.PropTypes.func.isRequired,
        onResourceDeselected: React.PropTypes.func.isRequired,
        previewedResource: React.PropTypes.instanceOf(Backbone.Model),
        selectedResources: React.PropTypes.instanceOf(Backbone.Collection)
    },

    getInstanceRows: function(instances) {
        var previewedResource = this.props.previewedResource,
            selectedResources = this.props.selectedResources;

        return instances.map(function(instance) {
            let uuid = instance.get("uuid"),
                isPreviewed = (previewedResource === instance),
                isChecked = selectedResources.findWhere({uuid}) ? true : false;

            return (
            <InstanceRow key={instance.id || instance.cid}
                instance={instance}
                onResourceSelected={this.props.onResourceSelected}
                onResourceDeselected={this.props.onResourceDeselected}
                onPreviewResource={this.props.onPreviewResource}
                isPreviewed={isPreviewed}
                isChecked={isChecked} />
            );
        }.bind(this));
    },

    render: function() {
        var instances = this.props.instances,
            instanceRows = this.getInstanceRows(instances);

        return (
        <SelectableTable resources={instances}
            selectedResources={this.props.selectedResources}
            resourceRows={instanceRows}
            onResourceSelected={this.props.onResourceSelected}
            onResourceDeselected={this.props.onResourceDeselected}>
            <th className="sm-header">
                Name
            </th>
            <th className="sm-header">
                Status
            </th>
            <th className="sm-header">
                Activity
            </th>
            <th className="sm-header">
                IP Address
            </th>
            <th className="sm-header">
                Size
            </th>
            <th className="sm-header">
                {featureFlags.hasProjectSharing() ? "Identity" : "Provider"}
            </th>
        </SelectableTable>
        )
    }
});
