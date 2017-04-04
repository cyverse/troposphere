import React from "react";
import Backbone from "backbone";
import stores from "stores";
import context from "context";
import ShareIcon from "components/common/ui/ShareIcon";

import { Link } from "react-router";

export default React.createClass({
    displayName: "Name",

    contextTypes: {
        projectId: React.PropTypes.number
    },

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
        return (<ShareIcon
                    owner={identity_owner}
                    isLeader={identity.get('is_leader')}
                />);
    },
    render: function() {
        var instance = this.props.instance,
            identityId = instance.get('identity').id,
            instanceId = instance.get('id'),
            name = instance.get("name").trim() || "[no instance name]",
            identity = stores.IdentityStore.get(identityId),
            projectId = this.context.projectId;

        if (!instanceId || !identity) {
            return (
            <span style={{ opacity: 0.57 }}>{instance.get("name")}</span>
            );
        }

        return (
        <Link to={`/projects/${projectId}/instances/${instance.id}`}>
            {this.render_share_icon(identity)}
            {name}
        </Link>
        );
    }
});
