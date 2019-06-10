import React from "react";
import Backbone from "backbone";
import InstanceRow from "./InstanceRow";
import TableActions from "../TableActions";
import SelectableTable from "../SelectableTable";
import featureFlags from "utilities/featureFlags";
import {
    compareRoot,
    compareRootReverse,
    compareChild
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
        comparator: compareRoot("status")
    },
    {
        value: "ip_address",
        label: "IP Address",
        comparator: compareRoot("ip_address")
    },
    {
        value: "activity",
        label: "Activity",
        comparator: compareRoot("activity")
    },
    {
        value: "start_date",
        label: "Start Date",
        comparator: compareRootReverse("start_date")
    },
    {
        value: "size",
        label: "Size",
        comparator: compareName("size")
    },
    {
        value: "provider",
        label: "Provider",
        comparator: compareName("provider")
    }
];

export default React.createClass({
    displayName: "InstanceTable",
    getInitialState() {
        return {
            sortBy: "name"
        };
    },

    propTypes: {
        instances: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        onResourceSelected: React.PropTypes.func.isRequired,
        onResourceDeselected: React.PropTypes.func.isRequired,
        previewedResource: React.PropTypes.instanceOf(Backbone.Model),
        selectedResources: React.PropTypes.instanceOf(Backbone.Collection)
    },

    onChangeSort(e) {
        this.setState({sortBy: e.target.value});
    },

    getInstanceRows(instances) {
        var previewedResource = this.props.previewedResource,
            selectedResources = this.props.selectedResources;

        return instances.map(
            function(instance) {
                let uuid = instance.get("uuid"),
                    isPreviewed = previewedResource === instance,
                    isChecked = selectedResources.findWhere({uuid})
                        ? true
                        : false;

                return (
                    <InstanceRow
                        key={instance.id || instance.cid}
                        instance={instance}
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

    render() {
        const {instances} = this.props;
        const {sortBy} = this.state;
        instances.comparator = getComparator(sortOptions, sortBy);
        const sortedInstances = instances.sort();
        const instanceRows = this.getInstanceRows(sortedInstances);

        return (
            <div>
                <TableActions
                    sortBy={sortBy}
                    sortOptions={sortOptions}
                    onChangeSort={this.onChangeSort}
                />
                <SelectableTable
                    resources={sortedInstances}
                    selectedResources={this.props.selectedResources}
                    resourceRows={instanceRows}
                    onResourceSelected={this.props.onResourceSelected}
                    onResourceDeselected={this.props.onResourceDeselected}>
                    <th style={{cursor: "pointer"}} className="sm-header">
                        Name
                    </th>
                    <th className="sm-header">Status</th>
                    <th className="sm-header">Activity</th>
                    <th className="sm-header">IP Address</th>
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
