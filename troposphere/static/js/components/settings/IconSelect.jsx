import _ from "underscore";
import React from "react";
import IconOption from "./IconOption";

export default React.createClass({
    displayName: "IconSelect",

    getDefaultProps: function() {
        return {
            icons: {
                "default": "Identicons",
                retro: "Retro",
                robot: "Robots",
                monster: "Monsters",
                wavatar: "Wavatars"
            }
        };
    },

    handleClick: function(icon_type, e) {
        e.preventDefault();
        this.props.onSelect(icon_type);
    },

    render: function() {
        var icons = _.map(this.props.icons, function(text, type) {
            var isSelected = (type == this.props.selected);
            return (
            <IconOption key={text}
                type={type}
                text={text}
                selected={isSelected}
                onClick={this.handleClick} />
            );
        }.bind(this));

        return (
        <ul id="icon-set-select">
            {icons}
        </ul>
        );
    }

});
