import React from "react";
import Backbone from "backbone";
import stores from "stores";

export default React.createClass({
    displayName: "Identity",

    propTypes: {
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    render_text: function(provider, identity) {
        return identity.get('key')+" on " + provider.get("name");
    },
    render: function() {
        var instance = this.props.instance,
            provider = stores.ProviderStore.get(instance.get("provider").id),
            identity = stores.IdentityStore.get(instance.get("identity").id);

        if (!provider || !identity) return <div className="loading-tiny-inline"></div>;

        return (
        <span>{this.render_text(provider, identity)}</span>
        );
    }
});
