import React from "react";
import Backbone from "backbone";
import ResourceDetail from "components/projects/common/ResourceDetail";
import ShareIcon from "components/common/ui/ShareIcon";

import subscribe from "utilities/subscribe";
import context from "context";

import featureFlags from "utilities/featureFlags";


const Identity = React.createClass({
    displayName: "Identity",

    propTypes: {
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    render_share_icon: function(identity) {
        let current_user = context.profile.get('username');
        let identity_owner = identity.get('user').username;
        if(identity_owner == current_user) {
            return; //Owned by user
        }
        //Shared with user
        return (
            <ShareIcon
                owner={identity_owner}
                isLeader={identity.get('is_leader')}
            />);
    },

    render: function() {
        let { IdentityStore, ProviderStore } = this.props.subscriptions;
        var instance = this.props.instance,
            identity = IdentityStore.get(instance.get("identity").id),
            provider = ProviderStore.get(instance.get("provider").id),
            resourceLabel = featureFlags.hasProjectSharing() ? "Identity" : "Provider";

        if (!provider || !identity) return <div className="loading-tiny-inline"></div>;

        let identity_text = identity.getName();

        return (
        <ResourceDetail label={resourceLabel}>
            {this.render_share_icon(identity)}
            {identity_text}
        </ResourceDetail>
        );
    }
});

export default subscribe(Identity, ["ProviderStore", "IdentityStore"]);
