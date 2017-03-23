import React from "react";
import Backbone from "backbone";
import { Link } from "react-router";


export default React.createClass({
    displayName: "Name",

    propTypes: {
        image: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    render: function() {
        var image = this.props.image;

        if (!image.id) {
            return (
            <span>{image.get("name")}</span>
            );
        }

        return (
        <Link to={`images/${image.id}`}>
            {image.get("name")}
        </Link>
        );
    }
});
