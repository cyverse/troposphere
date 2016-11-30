import React from "react";
import Backbone from "backbone";
import stores from "stores";

export default React.createClass({
    displayName: "Identity",

    propTypes: {
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    render_text: function(provider, identity) {
        if( identity == null) {
            return "--- on " + provider.get("name");
        }
        return identity.get("key") + " on " + provider.get("name");
    },
    render: function() {
        var instance = this.props.instance,
            identity = stores.IdentityStore.get(instance.get('identity').id),
            provider = stores.ProviderStore.get(instance.get("provider").id);

        if (!provider || !identity) return <div className="loading-tiny-inline"></div>;
        //Note: This key likely isn't unique for each row in the table, could fix by just using key: instance.get('provider_alias')
        return (
            <span key={identity.get("uuid")} >{this.render_text(provider, identity)}</span>
        );
    }
});
