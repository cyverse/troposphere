import React from "react";
import Backbone from "backbone";

import FormattedIpAddress from "components/projects/common/FormattedIpAddress";


export default React.createClass({
    displayName: "IpAddress",

    propTypes: {
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    render: function() {
        let { instance } = this.props;

        return (
            <FormattedIpAddress instance={instance} />
        );
    }
});
