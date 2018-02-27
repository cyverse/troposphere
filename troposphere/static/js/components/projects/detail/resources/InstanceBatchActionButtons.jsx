import React from "react";
import Backbone from "backbone";

import { filterInstances } from "utilities/filterCollection";

import Button from "./Button";
import modals from "modals";


export default React.createClass({
    displayName: "InstanceBatchActionButtons",

    propTypes: {
        multipleSelected: React.PropTypes.bool.isRequired,
        selectedResources: React.PropTypes.instanceOf(Backbone.Collection),
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        project: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    onStart: function() {
        modals.InstanceModals.start(this.props.instance);
    },

    onSuspend: function() {
        modals.InstanceModals.suspend(this.props.instance);
    },

    onStop: function() {
        modals.InstanceModals.stop(this.props.instance);
    },

    onReboot: function() {
        modals.InstanceModals.reboot(this.props.instance);
    },

    onResume: function() {
        modals.InstanceModals.resume(this.props.instance);
    },

/*
    onStart: function() {
        let { selectedResources } = this.props,
            instances = selectedResources.filter(filterInstances);

        modals.InstanceModals.start(instances);
        this.props.onUnselectAll();
    },

    onSuspend: function() {
        let { selectedResources } = this.props,
            instances = selectedResources.filter(filterInstances);

        modals.InstanceModals.suspend(instances);
        this.props.onUnselectAll();
    },

    onStop: function() {
        let { selectedResources } = this.props,
            instances = selectedResources.filter(filterInstances);

        modals.InstanceModals.stop(instances);
        this.props.onUnselectAll();
    },

    onResume: function() {
        let { selectedResources } = this.props,
            instances = selectedResources.filter(filterInstances);

        modals.InstanceModals.resume(instances);
        this.props.onUnselectAll();
    },

    onReboot: function() {
        // NOTE: -- @lenards
        // Intentionally *not* supporting bulk/batch actions
        modals.InstanceModals.reboot(this.props.instance);
    },
*/

    onDelete: function() {
        // *all* _on_{{action}} functions should consider unselect(ing)
        let { selectedResources, project } = this.props,
            instances = selectedResources.cfilter(filterInstances);

        modals.InstanceModals.destroy({
            instances,
            project
        });
        this.props.onUnselectAll();
    },

    render: function() {
        let { instance,
              selectedResources,
              multipleSelected } = this.props,
            status = instance.get("state").get("status"),
            linksArray = [],
            style = {
                marginRight: "10px"
            };

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
                // NOTE: we are not going to make rebooting
                // multiple instances *possible*, but this
                // was an artifical decision made by me,
                // @lenards, after discussing it with
                // @steve-gregory - this could be done if
                // there is any value in that bulk action
                if (!multipleSelected) {
                    linksArray.push(
                        <Button style={style}
                                key="Reboot"
                                icon="repeat"
                                tooltip="Reboot the selected instance"
                                onClick={this.onReboot}
                                isVisible={true} />
                    );
                }
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

            // In a crazy world with "Delete ALL"
            linksArray.push(
              <Button
                  key="Delete"
                  icon="remove"
                  tooltip="Delete"
                  onClick={this.onDelete}
                  isVisible={true}
              />
            );

        }

        return (
        <div className="clearfix u-md-pull-right">
            {linksArray}
        </div>
        );
    }
});
