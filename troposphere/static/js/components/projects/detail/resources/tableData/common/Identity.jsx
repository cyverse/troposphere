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
            { IdentityStore } = this.props.subscriptions,
            resource_shared_with_me = project_resource.get('project').shared_with_me,
            resource_location = project_resource.get('identity').provider_location,
            content;
        if(resource_shared_with_me) {
            content = resource_location;
        } else {
            let identity = IdentityStore.get(project_resource.get("identity").id);
            if (!identity) {
                return <div className="loading-tiny-inline"></div>;
            }
            content = identity.getName()
        }
        return (
            <span>{content}</span>
        );
    }
});

export default subscribe(Identity, ["IdentityStore"]);
