import React from "react";
import Backbone from "backbone";

import ResourceDetail from "components/projects/common/ResourceDetail";
import FormattedIpAddress from "components/projects/common/FormattedIpAddress";


export default React.createClass({
    displayName: "IpAddress",

    propTypes: {
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    render() {
        let { instance } = this.props;

        return (
        <ResourceDetail label="IP Address">
            <FormattedIpAddress instance={instance} includeCopyButton />
        </ResourceDetail>
        );
    }
});
