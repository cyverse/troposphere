import React from "react";
import Backbone from "backbone";
import VolumeRow from "./VolumeRow";
import SelectableTable from "../SelectableTable";

import featureFlags from "utilities/featureFlags";


export default React.createClass({
    displayName: "VolumeTable",

    propTypes: {
        volumes: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        onResourceSelected: React.PropTypes.func.isRequired,
        onResourceDeselected: React.PropTypes.func.isRequired,
        onPreviewResource: React.PropTypes.func.isRequired,
        previewedResource: React.PropTypes.instanceOf(Backbone.Model),
        selectedResources: React.PropTypes.instanceOf(Backbone.Collection)
    },

    getInitialState: function() {
        return {
            isChecked: false
        }
    },

    toggleCheckbox: function(e) {
        this.setState({
            isChecked: !this.state.isChecked
        });
    },

    getVolumeRows: function(volumes) {
        var previewedResource = this.props.previewedResource,
            selectedResources = this.props.selectedResources;

        return volumes.map(function(volume) {
            let uuid = volume.get("uuid"),
                isPreviewed = (previewedResource === volume),
                isChecked = selectedResources.findWhere({uuid}) ? true : false;

            return (
            <VolumeRow key={volume.id || volume.cid}
                volume={volume}
                onResourceSelected={this.props.onResourceSelected}
                onResourceDeselected={this.props.onResourceDeselected}
                onPreviewResource={this.props.onPreviewResource}
                isPreviewed={isPreviewed}
                isChecked={isChecked} />
            );
        }.bind(this));
    },

    render: function() {
        var volumes = this.props.volumes,
            volumeRows = this.getVolumeRows(volumes);

        return (
        <SelectableTable resources={volumes}
            selectedResources={this.props.selectedResources}
            resourceRows={volumeRows}
            onResourceSelected={this.props.onResourceSelected}
            onResourceDeselected={this.props.onResourceDeselected}>
            <th className="sm-header">
                Name
            </th>
            <th className="sm-header">
                Status
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
