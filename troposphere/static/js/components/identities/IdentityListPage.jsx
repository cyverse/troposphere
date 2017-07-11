import React from "react";
import IdentityListView from "./list/IdentityListView";
import stores from "stores";


function getIdentityState() {
    return {
        identities: stores.IdentityStore.getAll()
    };
}

export default React.createClass({
    displayName: "IdentityListPage",

    //
    // Mounting & State
    // ----------------
    //
    getInitialState: function() {
        return getIdentityState();
    },

    updateImages: function() {
        if (this.isMounted()) this.setState(getIdentityState());
    },

    componentDidMount: function() {
        stores.IdentityStore.addChangeListener(this.updateImages);
    },

    componentWillUnmount: function() {
        stores.IdentityStore.removeChangeListener(this.updateImages);
    },

    //
    // Render
    // ------
    //
    render: function() {
        if (this.state.identities) {
            return (
            <IdentityListView identities={this.state.identities} />
            );
        } else {
            return (
            <div className="loading"></div>
            );
        }
    }
});
