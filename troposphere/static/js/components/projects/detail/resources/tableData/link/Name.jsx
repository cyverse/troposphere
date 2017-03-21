import React from "react";
import Backbone from "backbone";
import { Link } from "react-router";


export default React.createClass({

    contextTypes: {
        projectId: React.PropTypes.number
    },

    propTypes: {
        external_link: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    render: function() {
        let external_link = this.props.external_link,
            linkId = external_link.id,
            projectId = this.context.projectId;

        if (!linkId) {
            return (
            <span>{external_link.get("title")}</span>
            );
        }

        return (
        <Link to={`/projects/${projectId}/links/${linkId}`}>
            {external_link.get("title")}
        </Link>
        );
    }
});
