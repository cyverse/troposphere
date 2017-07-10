import React from "react";

import SecondaryIdentityNavigation from "../common/SecondaryIdentityNavigation";
import stores from "stores";


export default React.createClass({
    displayName: "IdentityDetailsMaster",

    getChildContext() {
        return { identityId: Number(this.props.params.identityId) };
    },

   childContextTypes: {
        identityId: React.PropTypes.number
    },

    updateState: function() {
        this.forceUpdate();
    },

    componentDidMount: function() {
        stores.IdentityStore.addChangeListener(this.updateState);
    },

    componentWillUnmount: function() {
        stores.IdentityStore.removeChangeListener(this.updateState);
    },

    render: function() {
        var identity = stores.IdentityStore.get(Number(this.props.params.identityId));

        if (!identity) {
            return (
            <div className="loading"></div>
            )
        }

        return (
        <div className="identity-details">
            <SecondaryIdentityNavigation identity={identity} currentRoute="todo-remove-this" />
            {this.props.children}
        </div>
        );
    }
});
