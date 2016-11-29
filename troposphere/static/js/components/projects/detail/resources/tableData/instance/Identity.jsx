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
        return identity.key + " on " + provider.get("name");
    },
    render: function() {
        var instance = this.props.instance,
            identity = instance.get('identity'),
            provider = stores.ProviderStore.get(instance.get("provider").id);

        if (!provider) return <div className="loading-tiny-inline"></div>;

        return (
        <span>{this.render_text(provider, identity)}</span>
        );
    }
});
