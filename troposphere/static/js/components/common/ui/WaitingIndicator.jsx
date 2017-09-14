import React from "react";

/**
 * "material-ui/RefreshIndicator" was not used because `top` & `left` position CSS
 * attributes were required; it seemed unlikely this was a good approach with the
 * faux "placeholder" -- @lenards (2017-08-21)
 */
const WaitingIndicator = React.createClass({
    propTypes: {
        label: React.PropTypes.string,
    },
    getDefaultProps() {
        return {
            label: "Launching ...",
        }
    },

    render() {
        let style = {
            fontWeight: 500,
            fontSize: "14px",
            letterSpacing: "0px",
            textTransform: "uppercase",
            userSelect: "none",
            margin: "0px",
            paddingLeft: "10px",
            paddingRight: "16px",
            opacity: 1,
            color: "rgba(0, 0, 0, 0.87)"
        };
        return (
            <div style={{height: "36px", display: "flex", alignItems: "center"}}
                 className="pull-right">
              <span className="loading-tiny-inline" />
              <span style={style}>{this.props.label}</span>
            </div>
        );
    }
});

export default WaitingIndicator;
