import React from "react";
import Router from "react-router";
import stores from "stores";
import Name from "./Name";
import Stats from "./Stats";
import Description from "./Description";
import Instances from "./Instances";
import Resources from "./Resources";

export default React.createClass({
    displayName: "ProviderListView",

    mixins: [Router.State],


    render: function() {
        // we are fetching the provider here (and not in getInitialState) because the component
        // doesn't get re-mounted when the url changes, so those functions won't run twice
        var provider_id = Number(this.getParams().id);
        var provider = stores.ProviderStore.get(provider_id);

        if (!provider) return <div className="loading"></div>;

        return (
        <div className="provider-details">
            <Name provider={provider} />
            <hr/>
            <Stats provider={provider} />
            <Description provider={provider} />
            <Instances provider={provider} />
            <Resources provider={provider} />
        </div>
        );

    }

});
