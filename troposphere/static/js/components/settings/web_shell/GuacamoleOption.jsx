import _ from "underscore";
import React from "react";
import greenBlackImage from "images/green-black.png";
import whiteBlackImage from "images/white-black.png";
import blackWhiteImage from "images/black-white.png";
import grayBlackImage from "images/gray-black.png";

export default React.createClass({
    displayName: "GuacamoleOption",

    getSrc: function(color) {
        switch (color) {
            case "green_black":
                return greenBlackImage;
            case "white_black":
                return whiteBlackImage;
            case "black_white":
                return blackWhiteImage;
            default:
                return grayBlackImage;
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
