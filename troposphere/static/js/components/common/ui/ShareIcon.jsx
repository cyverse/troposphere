import React from "react";
import Tooltip from "react-tooltip";

export default React.createClass({
    displayName: "ShareIcon",

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
