import React from "react";
import stores from "stores";
import ProviderList from "./ProviderList";

export default React.createClass({
    displayName: "ProvidersListSection",

    getState: function() {
        return {
            providers: stores.ProviderStore.getAll()
        };
    },

    getInitialState: function() {
        return this.getState();
    },

    updateState: function() {
        if (this.isMounted()) this.setState(this.getState());
    },

    componentDidMount: function() {
        stores.ProviderStore.addChangeListener(this.updateState);
    },

    componentWillUnmount: function() {
        stores.ProviderStore.removeChangeListener(this.updateState);
    },


    render: function() {
        let providers = this.state.providers;
        if (!providers) return <div className="loading"></div>;
        return (
        <div style={{ paddingTop: "50px" }}>
            <header>
                <h1 className="t-display-1">Your Providers</h1>
            </header>
            <ProviderList providers={providers} />
        </div>
        )
    }

});
