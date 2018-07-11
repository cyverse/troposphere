import React from "react";
import Backbone from "backbone";

import Tooltip from "react-tooltip";

const deployError =
    "Performing a 'hard reboot' will sometimes fix a 'deploy_error' on an instance";

var Activity = React.createClass({
    displayName: "Activity",

    propTypes: {
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    getInitialState() {
        return {
            opacity: "0.68"
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
        var instance = this.props.instance,
            stylez = {
                textTransform: "capitalize"
            },
            attention,
            activity = instance.get("state").get("activity") || "N/A";

        if (activity && activity === "deploy_error") {
            let rand = Math.random() + "",
                {opacity} = this.state,
                marginLeft = "10px",
                color = "darkorange";

            attention = (
                <span>
                    <span
                        onMouseOver={this.onMouseOver}
                        onMouseOut={this.onMouseOut}
                        style={{opacity, marginLeft, color}}
                        data-tip={deployError}
                        className="glyphicon glyphicon-info-sign"
                        data-for={rand}
                        aria-hidden="true"
                    />
                    <Tooltip
                        id={rand}
                        place="top"
                        effect="solid"
                        delayHide={2250}
                    />
                </span>
            );
        }

        return (
            <span style={stylez}>
                {activity}
                {attention}
            </span>
        );
    }
});

export default Activity;
