import React from "react";
import Backbone from "backbone";
import { Link } from "react-router";

export default React.createClass({
    displayName: "Name",

    mixins: [Router.State],

    propTypes: {
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    render: function() {
        var instance = this.props.instance,
            name = instance.get("name").trim() || "[no instance name]";

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
