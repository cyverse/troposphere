import React from "react";
import Backbone from "backbone";
import Router from "react-router";
import stores from "stores";
import context from "context";
import ShareIcon from "components/common/ui/ShareIcon";


export default React.createClass({
    displayName: "Name",

    mixins: [Router.State],

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
            identity = stores.IdentityStore.get(instance.get('identity').id),
            name = instance.get("name").trim() || "[no instance name]";

        if ((instance && !instance.get("id") ) || !identity) {
            return (
            <span style={{ opacity: 0.57 }}>{instance.get("name")}</span>
            );
        }

        return (
        <Router.Link to="project-instance-details" params={{ projectId: this.getParams().projectId, instanceId: instance.id }}>
            {this.render_share_icon(identity)}
            {name}
        </Router.Link>
        );
    }
});
