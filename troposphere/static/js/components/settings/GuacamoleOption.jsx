import _ from "underscore";
import React from "react";

export default React.createClass({
    displayName: "GuacamoleOption",

    getSrc: function(color) {
        switch (color) {
            case "green_black":
                return "/assets/bundles/theme/images/green-black.png";
            case "white_black":
                return "/assets/bundles/theme/images/white-black.png";
            case "black_white":
                return "/assets/bundles/theme/images/black-white.png";
            default:
                return "/assets/bundles/theme/images/gray-black.png";
        }
    },

    render: function() {
        var onClick = _.partial(this.props.onClick, this.props.type);
        var imgSrc = this.getSrc(this.props.type);

        return (
        <li className={this.props.selected ? "selected" : ""}>
            <a href="#" onClick={onClick}>
                <img src={imgSrc} width="100" height="100" />
                <br/>
                {this.props.text}
            </a>
        </li>
        );
    }
});
