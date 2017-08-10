import React from "react";
import Backbone from "backbone";
import { Link } from "react-router";
import context from "context";
import ShareIcon from "components/common/ui/ShareIcon";
import subscribe from "utilities/subscribe";


const Name = React.createClass({
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
        let IdentityStore = this.props.subscriptions.IdentityStore;
        var instance = this.props.instance,
            name = instance.get("name").trim() || "[no instance name]",
            identity = IdentityStore.get(instance.get('identity').id),
            projectId = this.context.projectId;

        if ((instance && !instance.get("id") ) || !identity) {
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

export default subscribe(Name, ["IdentityStore"]);
