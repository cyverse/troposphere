import React from "react";
import Backbone from "backbone";
import VolumeRow from "./VolumeRow";
import SelectableTable from "../SelectableTable";
import TableActions from "../TableActions";
import featureFlags from "utilities/featureFlags";

import {
    compareRoot,
    compareChild,
    compareWithMethodReverse
} from "utilities/comparators";

const getComparator = (options, sortBy) =>
    options.find(obj => obj.value === sortBy).comparator;

const compareName = compareChild("name");
const sortOptions = [
    {
        value: "name",
        label: "Name",
        comparator: compareRoot("name")
    },
    {
        value: "status",
        label: "Status",
        comparator: compareWithMethodReverse(item =>
            item.get("state").get("status")
        )
    },
    {
        value: "start_date",
        label: "Start Date",
        comparator: compareRoot("start_date")
    },
    {
        value: "size",
        label: "Size",
        comparator: compareRoot("size")
    },
    {
        value: "provider",
        label: "Provider",
        comparator: compareName("provider")
    }
];

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
            isChecked: false,
            sortBy: "name"
        };
    },

    onChangeSort(e) {
        this.setState({sortBy: e.target.value});
    },

    toggleCheckbox: function(e) {
        this.setState({
            isChecked: !this.state.isChecked
        });
    },

    getVolumeRows: function(volumes) {
        var previewedResource = this.props.previewedResource,
            selectedResources = this.props.selectedResources;

        return volumes.map(
            function(volume) {
                let uuid = volume.get("uuid"),
                    isPreviewed = previewedResource === volume,
                    isChecked = selectedResources.findWhere({uuid})
                        ? true
                        : false;

                return (
                    <VolumeRow
                        key={volume.id || volume.cid}
                        volume={volume}
                        onResourceSelected={this.props.onResourceSelected}
                        onResourceDeselected={this.props.onResourceDeselected}
                        onPreviewResource={this.props.onPreviewResource}
                        isPreviewed={isPreviewed}
                        isChecked={isChecked}
                    />
                );
            }.bind(this)
        );
    },

    render: function() {
        const volumes = this.props.volumes;
        const {sortBy} = this.state;

        volumes.comparator = getComparator(sortOptions, sortBy);
        const sortedVolumes = volumes.sort();
        const volumeRows = this.getVolumeRows(sortedVolumes);

        return (
            <div>
                <TableActions
                    sortBy={sortBy}
                    sortOptions={sortOptions}
                    onChangeSort={this.onChangeSort}
                />
                <SelectableTable
                    resources={sortedVolumes}
                    selectedResources={this.props.selectedResources}
                    resourceRows={volumeRows}
                    onResourceSelected={this.props.onResourceSelected}
                    onResourceDeselected={this.props.onResourceDeselected}>
                    <th className="sm-header">Name</th>
                    <th className="sm-header">Status</th>
                    <th className="sm-header">Size</th>
                    <th className="sm-header">
                        {featureFlags.hasProjectSharing()
                            ? "Identity"
                            : "Provider"}
                    </th>
                </SelectableTable>
            </div>
        );
    }
});
