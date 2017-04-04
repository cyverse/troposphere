import React from "react";
import Backbone from "backbone";
import ResourceDetail from "components/projects/common/ResourceDetail";
import stores from "stores";
import context from "context";
import ShareIcon from "components/common/ui/ShareIcon";


export default React.createClass({
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
        var instance = this.props.instance,
            identity = stores.IdentityStore.get(instance.get("identity").id),
            provider = stores.ProviderStore.get(instance.get("provider").id);

        if (!provider || !identity) return <div className="loading-tiny-inline"></div>;
        let identity_text = identity.get("key") + " on " + provider.get("name");

        return (
        <ResourceDetail label="Identity">
            {this.render_share_icon(identity)}
            {identity_text}
        </ResourceDetail>
        );
    }

});
