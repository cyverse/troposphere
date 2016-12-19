import React from "react";
import Backbone from "backbone";
import { Link } from "react-router";

export default React.createClass({
    displayName: "Name",

    contextTypes: {
        params: React.PropTypes.object
    },

    propTypes: {
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    render: function() {
        let instance = this.props.instance,
            name = instance.get("name").trim() || "[no instance name]",
            projectId = this.context.params.projectId;

        if (instance && !instance.get("id")) {
            return (
            <span style={{ opacity: 0.57 }}>{instance.get("name")}</span>
            );
        }

        return (
        <Link to={`/projects/${projectId}/instances/${instance.id}`}>
            {name}
        </Link>
        );
    }
});
