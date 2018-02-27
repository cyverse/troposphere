import React from "react";
import Backbone from "backbone";

import Button from "./Button";
import SubMenu from "./SubMenu";
import RefreshButton from "./RefreshButton";
import RequestResourcesButton from "./RequestResourcesButton";
import ResourceActionButtons from "./ResourceActionButtons";

import context from "context";


export default React.createClass({
    displayName: "ButtonBar",

    propTypes: {
        isVisible: React.PropTypes.bool.isRequired,
        multipleSelected: React.PropTypes.bool.isRequired,
        selectedResources: React.PropTypes.instanceOf(Backbone.Collection),
        onMoveSelectedResources: React.PropTypes.func.isRequired,
        onDeleteSelectedResources: React.PropTypes.func.isRequired,
        onReportSelectedResources: React.PropTypes.func.isRequired,
        onRemoveSelectedResources: React.PropTypes.func.isRequired,
        previewedResource: React.PropTypes.instanceOf(Backbone.Model),
        project: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    render: function() {

        // todo: put these back when we can support them properly
        // right now instances can't be deleted with volumes attached,
        // and volumes can't be deleted while attached to an instance
        // handling this in the UI state machine is just to complicated
        // at the moment. It's much easier to control if the user has to
        // delete things individually.
        //
        // <Button
        //   icon="trash"
        //   tooltip="Delete selected resources"
        //   onClick={this.props.onDeleteSelectedResources}
        //   isVisible={this.props.isVisible}
        // />
        //
        // <Button
        //   icon="list-alt"
        //   tooltip="Report issue with project or selected resources"
        //   onClick={this.props.onReportSelectedResources}
        //   isVisible={true}
        // />

        let {
            isVisible,
            onMoveSelectedResources,
            onRemoveSelectedResources,
            onUnselect,
            onUnselectAll,
            previewedResource,
            selectedResources,
            multipleSelected,
            project } = this.props;

        let isSuperUser = context.profile.get("is_superuser");

        return (
        <div
            style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "flex-start",
                justifyContent: "space-between",
            }}
        >
            <div
                style={{
                    marginBottom: "10px",
                }}
            >
                <SubMenu { ...this.props }/>
                <RefreshButton/>
                <RequestResourcesButton />
                <Button icon="folder-open"
                    tooltip="Move selected resources"
                    onClick={onMoveSelectedResources}
                    isVisible={isVisible} />
                <Button icon="export"
                    tooltip="Remove selected resources (admin only)"
                    onClick={onRemoveSelectedResources}
                    style={{ "backgroundColor": "bisque" }}
                    isVisible={isSuperUser && isVisible} />

            </div>
            <div>
                <ResourceActionButtons
                    onUnselect={onUnselect}
                    onUnselectAll={onUnselectAll}
                    previewedResource={previewedResource}
                    selectedResources={selectedResources}
                    multipleSelected={multipleSelected}
                    project={project} />
            </div>
        </div>
        );
    }
});
