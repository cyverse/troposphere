import React from "react";
import Backbone from "backbone";
import ResourceDetail from "components/projects/common/ResourceDetail";
import CopyButton from "components/common/ui/CopyButton";

export default React.createClass({
    displayName: "IpAddress",

    propTypes: {
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    render() {
        var instance = this.props.instance,
            address = instance.get("ip_address");

        let missingAddress = !address || address.charAt(0) == "0";
        if (missingAddress) {
            address = "N/A";
        }

        return (
        <ResourceDetail label="IP Address">
            {address}
            {!missingAddress ? <CopyButton text={ address }/> : null}
        </ResourceDetail>
        );
    }
});
