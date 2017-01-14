import React from "react";
import Backbone from "backbone";
// TODO remove after evaluation
import Raven from "raven-js";

import Button from "./Button";
import modals from "modals";


/**
 * I have some concern that calls to modals will fail,
 * this allows us to capture them in Sentry
 */
function captureMsg(ex) {
    if (Raven && Raven.isSetup()) {
        if (Raven.captureException) {
            Raven.captureException(ex);
        }
    }
}


export default React.createClass({
    displayName: "InstanceActionButtons_2",

    propTypes: {
        multipleSelected: React.PropTypes.bool.isRequired,
        selectedResources: React.PropTypes.instanceOf(Backbone.Collection),
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        project: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    onStart: function() {
        try {
            modals.InstanceModals.start(this.props.instance);
        } catch (ex) { captureMsg(ex); }
    },

    onSuspend: function() {
        try {
            modals.InstanceModals.suspend(this.props.selectedResources);
        } catch (ex) { captureMsg(ex); }
    },

    onStop: function() {
        try {
            modals.InstanceModals.stop(this.props.instance);
        } catch (ex) { captureMsg(ex); }
    },

    onReboot: function() {
        try {
            modals.InstanceModals.reboot(this.props.instance);
        } catch (ex) { captureMsg(ex); }
    },

    onResume: function() {
        try {
            modals.InstanceModals.resume(this.props.selectedResources);
        } catch (ex) { captureMsg(ex); }
    },

    onDelete: function() {
        // *all* _on_{{action}} functions should consider unselect(ing)
        this.props.onUnselect(this.props.instance);

        try {
            modals.InstanceModals.destroy({
                instance: this.props.instance,
                project: this.props.project
            });
        } catch (ex) { captureMsg(ex); }
    },

    render: function() {
        let { instance, selectedResources } = this.props,
            status = instance.get("state").get("status"),
            linksArray = [],
            style = {
                marginRight: "10px"
            };

        //debugger;

        if (selectedResources) {
            if (status === "active") {
                linksArray.push(
                    <Button style={style}
                        key="Suspend"
                        icon="pause"
                        tooltip="Suspend"
                        onClick={this.onSuspend}
                        isVisible={true} />
                );
                linksArray.push(
                    <Button style={style}
                        key="Stop"
                        icon="stop"
                        tooltip="Stop"
                        onClick={this.onStop}
                        isVisible={true} />
                );
                linksArray.push(
                    <Button style={style}
                        key="Reboot"
                        icon="repeat"
                        tooltip="Reboot the selected instance"
                        onClick={this.onReboot}
                        isVisible={true} />
                );
            } else if (status === "suspended") {
                linksArray.push(
                    <Button style={style}
                        key="Resume"
                        icon="play"
                        tooltip="Resume"
                        onClick={this.onResume}
                        isVisible={true} />
                );
            } else if (status === "shutoff") {
                linksArray.push(
                    <Button style={style}
                        key="Start"
                        icon="play"
                        tooltip="Start"
                        onClick={this.onStart}
                        isVisible={true} />
                );
            }
        }

        // TODO use featureFlag `BULK_RESOURCE_ACTIONS`


        /* if (!this.props.multipleSelected) {
         *     // Include "Delete" if only one resource
         *     // is currently selected - regardless of
         *     // the state of that resource
         *     linksArray.push(
         *       <Button
         *           key="Delete"
         *           icon="remove"
         *           tooltip="Delete"
         *           onClick={this.onDelete}
         *           isVisible={true}
         *       />
         *     );
         * }
         */

        return (
        <div className="clearfix u-md-pull-right">
            {linksArray}
        </div>
        );
    }
});
