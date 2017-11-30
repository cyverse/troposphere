import React from "react";
import Backbone from "backbone";
import { Link } from "react-router";

export default React.createClass({
    displayName: "Name",

    contextTypes: {
        projectId: React.PropTypes.number
    },

    propTypes: {
        volume: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    render: function() {
        let volume = this.props.volume,
            projectId = this.context.projectId;

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
