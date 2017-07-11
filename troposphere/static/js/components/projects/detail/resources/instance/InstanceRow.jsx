import React from "react";
import Backbone from "backbone";
import SelectableRow from "../SelectableRow";
import Name from "../tableData/instance/Name";
import Status from "../tableData/instance/Status";
import Activity from "../tableData/instance/Activity"
import IpAddress from "../tableData/instance/IpAddress";
import Size from "../tableData/instance/Size";
import Identity from "../tableData/common/Identity";
import CryptoJS from "crypto-js";
import Gravatar from "components/common/Gravatar";
import stores from "stores";

export default React.createClass({
    displayName: "InstanceRow",

    propTypes: {
        onResourceSelected: React.PropTypes.func.isRequired,
        onResourceDeselected: React.PropTypes.func.isRequired,
        onPreviewResource: React.PropTypes.func.isRequired,
        isPreviewed: React.PropTypes.bool,
        isChecked: React.PropTypes.bool,

        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    render: function() {
        var instance = this.props.instance,
            instanceHash = CryptoJS.MD5((instance.id || instance.cid).toString()).toString(),
            type = stores.ProfileStore.get().get("icon_set"),
            iconSize = 18;

        return (
        <SelectableRow isActive={this.props.isPreviewed}
            isSelected={this.props.isChecked}
            onResourceSelected={this.props.onResourceSelected}
            onResourceDeselected={this.props.onResourceDeselected}
            resource={this.props.instance}
            onPreviewResource={this.props.onPreviewResource}>
            <td className="image-preview sm-cell" data-label="Name">
                <Gravatar hash={instanceHash} size={iconSize} type={type} />
                <Name instance={instance} />
            </td>
            <td className="sm-cell" data-label="Status">
                <Status instance={instance} />
            </td>
            <td className="sm-cell" data-label="Activity">
                <Activity instance={instance} />
            </td>
            <td className="sm-cell" data-label="IP Address">
                <IpAddress instance={instance} />
            </td>
            <td className="sm-cell" data-label="Size">
                <Size instance={instance} />
            </td>
            <td className="sm-cell" data-label="Identity">
                <Identity project_resource={instance} />
            </td>
        </SelectableRow>
        );
    }
});
