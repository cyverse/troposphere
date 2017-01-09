import React from "react";
import Backbone from "backbone";
import ResourceDetail from "components/projects/common/ResourceDetail";

import { copyElement } from "utilities/clipboardFunctions";


export default React.createClass({
    displayName: "IpAddress",

    propTypes: {
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    onClick(e) {
        e.preventDefault();
        copyElement(e.target, { acknowledge: true });
    },

    render() {
        var instance = this.props.instance,
            address = instance.get("ip_address");

        if (!address || address.charAt(0) == "0") {
            address = "N/A";
        }

        return (
        <ResourceDetail label="IP Address" onClick={this.onClick}>
            {address}
        </ResourceDetail>
        );
    }
});
