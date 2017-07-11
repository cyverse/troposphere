import React from "react";
import Backbone from "backbone";
import subscribe from "utilities/subscribe";

const Identity = React.createClass({
    displayName: "Identity",

    propTypes: {
        project_resource: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    render: function() {
        var project_resource = this.props.project_resource,
            { IdentityStore } = this.props.subscriptions;

        let identity = IdentityStore.get(project_resource.get("identity").id);

        if (!identity) return <div className="loading-tiny-inline"></div>;
        return (
            <span>{identity.getName()}</span>
        );
    }
});

export default subscribe(Identity, ["IdentityStore"]);
