import React from "react";
import Backbone from "backbone";
import Button from "./Button";
import modals from "modals";

export default React.createClass({
    displayName: "VolumeActionButtons",

    propTypes: {
        multipleSelected: React.PropTypes.bool.isRequired,
        volume: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        project: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    onAttach: function() {
        modals.InstanceVolumeModals.attach(this.props.volume, this.props.project);
    },

    onDetach: function() {
        modals.InstanceVolumeModals.detach(this.props.volume);
    },

    onDelete: function() {
        this.props.onUnselect(this.props.volume);
        modals.VolumeModals.destroy({
            volume: this.props.volume,
            project: this.props.project
        });
    },

    render: function() {
        var volume = this.props.volume,
            status = volume.get("state").get("status"),
            style = {
                marginRight: "10px"
            },
            linksArray = [];

        // Add in the conditional links based on current machine state
        if (!this.props.multipleSelected && status === "available") {
            linksArray.push(
                <Button style={style}
                    key="Attach"
                    icon="save"
                    tooltip="Attach"
                    onClick={this.onAttach}
                    isVisible={true} />
            );
        } else if (!this.props.multipleSelected && status === "in-use") {
            linksArray.push(
                <Button style={style}
                    key="Detach"
                    icon="open"
                    tooltip="Detach"
                    onClick={this.onDetach}
                    isVisible={true} />
            );
        }

        linksArray.push(
            <Button key="Delete"
                icon="remove"
                tooltip="Delete"
                onClick={this.onDelete}
                isVisible={true} />
        );

        return (
        <div style={{
            display: "flex",
            justifyContent: "flex-end",
            flex: "1 1 10%",
            flexWrap: "nowrap"
        }}>
            {linksArray}
        </div>
        );
    }

});
