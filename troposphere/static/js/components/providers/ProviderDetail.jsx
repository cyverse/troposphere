import React from "react";

import stores from "stores";
import Name from "./Name";
import Stats from "./Stats";
import Description from "./Description";
import Instances from "./Instances";
import Resources from "./Resources";

export default React.createClass({
    displayName: "ProviderListView",

    componentDidMount: function() {
        stores.ProviderStore.addChangeListener(this.updateState);
    },

    componentWillUnmount: function() {
        stores.ProviderStore.removeChangeListener(this.updateState);
    },

    updateState: function() {
        this.forceUpdate();
    },

    render: function() {
        // we are fetching the provider here (and not in getInitialState) because the component
        // doesn't get re-mounted when the url changes, so those functions won't run twice
        var provider_id = Number(this.props.params.id);
        var provider = stores.ProviderStore.get(provider_id);

        if (!provider) return <div className="loading" />;

        return (
            <div className="provider-details">
                <Name provider={provider} />
                <hr />
                <Stats provider={provider} />
                <Description provider={provider} />
                <Instances provider={provider} />
                <Resources provider={provider} />
            </div>
        );
    }
});
