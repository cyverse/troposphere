import _ from "underscore";

import React from "react";


/**
 * Provides a "ribbon" effect over an icon
 *
 * @param text - what to string to place in the ribbon
 * @param styleOverride - overrides to default inline style
 *
 * Expectation:
 * this component will be a child of a container with
 * `position: "relative"`. If not, the absolute positioning
 * will cause this to be laid out, by default, in the upper
 * left corner of the viewport.
 */
export default React.createClass({
    propTypes: {
        text: React.PropTypes.string.isRequired,
        styleOverride: React.PropTypes.object
    },

    render() {
        let override = this.props.styleOverride || {},
            style = {
                position: "absolute",
                top: "3px",
                left: "0",
                background: "#F55A5A",
                display: "inline-block",
                padding: "3px 5px",
                color: "white",
                fontSize: "10px",
            },
            merged = _.extend(style, override);

        return (
            <div style={ merged }>
                {this.props.text}
            </div>
        );
    }
});
