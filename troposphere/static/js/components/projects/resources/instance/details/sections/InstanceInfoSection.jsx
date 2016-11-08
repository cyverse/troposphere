import React from "react";
import Backbone from "backbone";
import CryptoJS from "crypto-js";
import Gravatar from "components/common/Gravatar";
import EditableInputField from "components/common/EditableInputField";
import actions from "actions";
import stores from "stores";


export default React.createClass({
    displayName: "InstanceInfoSection",

    propTypes: {
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    getInitialState: function() {
        var instance = this.props.instance;

        return {
            name: instance.get("name"),
            isEditing: false,
            isEditingTags: false
        };
    },

    onEnterEditMode: function(e) {
        this.setState({
            isEditing: true
        });
    },

    onDoneEditing: function(text) {
        this.setState({
            name: text,
            isEditing: false
        });
        actions.InstanceActions.update(this.props.instance, {
            name: text
        });
    },

    onDebugInfo: function(e) {
        /**
         * Including as a way to facilitate collecting information without getting UI elements
         *
         * suggested format:
         *  <image-name> - <instance-GUID> - <provider> - <deploy-date-time> - <ip-address>
         *
         * altered format:
         *  <image-name> - <instance-GUID> - <provider> - <ip-address> - <deploy-date-time>
         *
         * I thought swapping the order would make _seeing_ the IP address easier than it
         * getting lost in the various bits of date-time info
         */

        let instance = this.props.instance,
            imageName = instance.get("image") ? instance.get("image").name : "...",
            uuid = instance.get("uuid") || "...",
            provider = instance.get("provider") ? instance.get("provider").name : "...",
            ip = instance.get("ip_address") || "x.x.x.x",
            startDate = instance.get("start_date") || "<no-start-date>";

        /* eslint-disable no-console */
        console.log(`${imageName} - ${uuid} - ${provider} - ${ip} - ${startDate}`);
        /* eslint-enable no-console */
    },

    render: function() {
        var instance = this.props.instance,
            instanceHash = CryptoJS.MD5((instance.id || instance.cid).toString()).toString(),
            type = stores.ProfileStore.get().get("icon_set"),
            iconSize = 113,
            nameContent;

        if (this.state.isEditing) {
            nameContent = (
                <EditableInputField text={this.state.name} onDoneEditing={this.onDoneEditing} />
            );
        } else {
            nameContent = (
                <h4 onClick={this.onEnterEditMode}>{this.state.name} <i className="glyphicon glyphicon-pencil"></i></h4>
            );
        }

        return (
            <div className="resource-info-section section clearfix">
                <div className="resource-image" onClick={this.onDebugInfo}>
                    <Gravatar hash={instanceHash}
                              size={iconSize}
                              type={type}/>
                </div>
                <div className="resource-info">
                    <div className="resource-name editable">
                        {nameContent}
                    </div>
                </div>
            </div>
        );
    }
});
