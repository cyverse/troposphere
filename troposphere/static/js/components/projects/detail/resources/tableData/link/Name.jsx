import React from "react";
import Backbone from "backbone";
import { Link } from "react-router";


export default React.createClass({

    mixins: [Router.State],

    propTypes: {
        external_link: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    render: function() {
        var external_link = this.props.external_link;

        if (!external_link.id) {
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
