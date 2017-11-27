import React from "react";
import Backbone from "backbone";
import { Link } from "react-router";
import context from "context";
import ShareIcon from "components/common/ui/ShareIcon";
import subscribe from "utilities/subscribe";


const Name = React.createClass({
    displayName: "Name",

    contextTypes: {
        projectId: React.PropTypes.string
    },

    propTypes: {
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    render_share_icon: function(instance) {
        let { IdentityStore } = this.props.subscriptions,
            instance_identity_id = instance.get('identity').id,
            identity_owner = instance.get('project').owner,
            instance_shared_with_me = instance.get('project').shared_with_me,
            current_user = context.profile.get('username'),
            identity;
        if (instance_shared_with_me) {
            return (<ShareIcon
                    owner={identity_owner}
                    isLeader={false}
                />);
        }
        identity = IdentityStore.get(instance_identity_id);
        // No identity found, nothing to do.
        if(!identity) {
            return;
        }
        identity_owner = identity.get('user').username;
        if(identity_owner == current_user) {
            // TODO: This ownership test will likely change in the future.
            return;
        }
        // Assert: This resource is part of a shared project,
        // show the share icon.
        return (<ShareIcon
                    owner={identity_owner}
                    isLeader={identity.get('is_leader')}
                />);
    },
    render: function() {
        var instance = this.props.instance,
            name = instance.get("name").trim() || "[no instance name]",
            projectId = this.context.projectId;

        if ((instance && !instance.get("id") )) {
            return (
            <span style={{ opacity: 0.57 }}>{instance.get("name")}</span>
            );
        }

        return (
        <Link to={`/projects/${projectId}/instances/${instance.id}`}>
            {this.render_share_icon(instance)}
            {name}
        </Link>
        );
    }
});

export default subscribe(Name, ["IdentityStore"]);
