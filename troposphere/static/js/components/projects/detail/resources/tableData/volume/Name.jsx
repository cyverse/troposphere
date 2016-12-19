import React from "react";
import Backbone from "backbone";
import { Link } from "react-router";

export default React.createClass({

    mixins: [Router.State],

    propTypes: {
        volume: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    render: function() {
        var volume = this.props.volume;

        if (!volume.id) {
            return (
            <span>{volume.get("name")}</span>
            );
        }

        return (
        <Link to={`/projects/${projectId}/volumes/${volume.id}`}>
            {volume.get("name")}
        </Link>
        );
    }
});
