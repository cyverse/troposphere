import React from "react";
import Backbone from "backbone";
import { Link } from "react-router";

export default React.createClass({

    contextTypes: {
        params: React.PropTypes.object
    },

    propTypes: {
        volume: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    render: function() {
        let volume = this.props.volume,
            projectId = this.context.params.projectId;

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
