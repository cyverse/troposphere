import React from "react";

import IdentityResourcesWrapper from "./detail/resources/IdentityResourcesWrapper";
import IdentityDetails from "./detail/resources/IdentityDetails";
import stores from "stores";



export default React.createClass({
    displayName: "IdentityResouresPage",

    propTypes: {
        params: React.PropTypes.object
    },

    render: function() {
        let identity = stores.IdentityStore.get(Number(this.props.params.identityId)),
            helpLinks = stores.HelpLinkStore.getAll();

        if (!identity && !helpLinks) {
            return (
            <div className="loading"></div>
            );
        }

        return (
        <IdentityResourcesWrapper identity={identity}>
            <IdentityDetails identity={identity} />
        </IdentityResourcesWrapper>
        );
    }

});
