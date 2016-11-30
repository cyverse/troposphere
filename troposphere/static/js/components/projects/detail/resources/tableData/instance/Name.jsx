import React from "react";
import Backbone from "backbone";
import Router from "react-router";
import stores from "stores";
import Tooltip from "react-tooltip";

const ShareIcon = React.createClass({
    getDefaultProps() {
        return {
            tip: "This is a shared resource that was created by another user.",
        };
    },
    getInitialState() {
        return {
            opacity: "0.4",
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
        let opacity = this.props.tip ? this.state.opacity : "0";
        let paddingLeft = "3px";
        let style = { opacity,
                      paddingLeft};
        let rand = Math.random() + "";
        return (
        <span><span onMouseOver={this.onMouseOver}
                  onMouseOut={this.onMouseOut}
                  style={ style }
                  data-tip={this.props.tip}
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
        if(identity.get('is_leader') == true) {
            return;
        }
        return (<ShareIcon />);
    },
    render: function() {
        var instance = this.props.instance,
            identity = stores.IdentityStore.get(instance.get('identity').id),
            name = instance.get("name").trim() || "[no instance name]";

        if (instance && !instance.get("id")) {
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
