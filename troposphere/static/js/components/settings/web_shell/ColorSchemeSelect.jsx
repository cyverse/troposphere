import _ from "underscore";
import React from "react";
import ColorSchemeOption from "./ColorSchemeOption";

export default React.createClass({
    displayName: "ColorSchemeSelect",

    getDefaultProps: function() {
        return {
            colors: {
                "default": "Gray on black",
                white_black: "White on black",
                green_black: "Green on black",
                black_white: "Black on white"
            }
        };
    },

    handleClick: function(color_type, e) {
        e.preventDefault();
        this.props.onSelect(color_type);
    },

    render: function() {
        var colors = _.map(this.props.colors, function(text, type) {
            var isSelected = (type == this.props.selected);
            return (
            <ColorSchemeOption key={text}
                type={type}
                text={text}
                selected={isSelected}
                onClick={this.handleClick} />
            );
        }.bind(this));

        return (
        <ul id="icon-set-select">
            {colors}
        </ul>
        );
    }

});
