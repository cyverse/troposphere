import React from "react";
import Backbone from "backbone";
import Router from "react-router";
import stores from "stores";
import context from "context";
import Tooltip from "react-tooltip";

const ShareIcon = React.createClass({
    propTypes: {
        owner: React.PropTypes.string.isRequired
    },

    getDefaultProps() {
        return {
            isLeader: false,
        };
    },
    getInitialState() {
        let share_message = "You have view-only access to this shared resource from " + this.props.owner;
        let leader_message = "You have full control to this shared resource from " + this.props.owner;
        //Note: I want to differentiate this icon based on leader-ship/viewer-ship.. Can we tap into theme here?
        let color = (this.props.isLeader) ? "green" : "red";
        let tip = (this.props.isLeader) ? leader_message : share_message;
        return {
            opacity: "0.4",
            color,
            tip,
        };
    },
    onMouseOver() {
        this.setState({
            opacity: "1"
        });
    },
    onMouseOut() {
        this.setState(this.getInitialState());
    },
    render() {
        let opacity = this.state.tip ? this.state.opacity : "0";
        let { color } = this.state;
        let marginRight = "3px";
        let style = { opacity,
                      color,
                      marginRight};
        let rand = Math.random() + "";
        return (
        <span><span onMouseOver={this.onMouseOver}
                  onMouseOut={this.onMouseOut}
                  style={ style }
                  data-tip={this.state.tip}
                  data-for={rand}
                  className="glyphicon glyphicon-user"
                  aria-hidden="true"></span>
        <Tooltip id={rand} place="top" effect="solid" />
        </span>
        );
    }
});

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
