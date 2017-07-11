import React from "react";

import IdentityMembership from "./IdentityMembership";
import ComponentHandleInputWithDelay from "components/mixins/ComponentHandleInputWithDelay";

import stores from "stores";
import modals from "modals";


export default React.createClass({
    displayName: "IdentityMembership",

    mixins: [ComponentHandleInputWithDelay],

    getInitialState: function() {
        return {
            query: "",
            selectedProviderId: -1,
            memberships: stores.IdentityMembershipStore.getAll(),
            allModels: null,
        };
    },

    updateState: function() {
        let query = this.state.query;
        let selected = this.state.selectedProviderId;
        let memberships;
        if (query !== null && query !== "" && selected !== -1) {
            memberships = stores.IdentityMembershipStore.fetchWhere({
                username: query,
                provider_id: selected,
            });
        } else {
            memberships = stores.IdentityMembershipStore.getAll();
        }

        this.setState({
            memberships,
        });
    },

    componentDidMount: function() {
        stores.IdentityMembershipStore.addChangeListener(this.updateState);
        stores.ProviderStore.addChangeListener(this.updateState);
    },

    componentWillUnmount: function() {
        stores.IdentityMembershipStore.removeChangeListener(this.updateState);
        stores.ProviderStore.removeChangeListener(this.updateState);
    },

    onProviderChange: function(e) {
        var provider_key = e.target.id,
            provider_id = provider_key.split("-")[1];

        if (provider_id === "all") {
            provider_id = -1
        }
        this.setState({
            selectedProviderId: provider_id
        });
    },

    onSearchChange: function(e) {
        // TODO: trim all these inputs yo
        var input = e.target.value.trim();
        this.setState({
            query: input
        }, () => {
            this.callIfNotInterruptedAfter(500 /* ms */ , this.updateState);
        });
    },

    renderTable: function() {
        let memberships = this.state.memberships;

        if (memberships == null) {
            return (<div className="loading"></div>);
        }

        var identityMembershipRows = memberships.map(function(membership) {
            return (
            <IdentityMembership key={membership.id} membership={membership} />
            )
        });

        if (!identityMembershipRows[0]) {
            return (
            <div style={{ paddingTop: "30px" }}>
                <h3 className="t-title">No IdentityMemberships were returned from the API</h3>
            </div>
            );
        }
        return (
        <table className="admin-table table table-striped table-hover" style={{ marginTop: "20px" }}>
            <tbody>
                <tr className="admin-row">
                    <th>
                        <h4 className="t-body-2">User</h4>
                    </th>
                    <th>
                        <h4 className="t-body-2">Identity</h4>
                    </th>
                    <th>
                        <h4 className="t-body-2">Provider</h4>
                    </th>
                    <th>
                        <h4 className="t-body-2">Enabled/Disabled</h4>
                    </th>
                </tr>
                {identityMembershipRows}
            </tbody>
        </table>
        );
    },
    renderAllProviderRow: function(provider) {
        var provider_id = "provider-all";
        return (
        <button className="btn btn-default"
            style={{ marginRight: "10px" }}
            id={provider_id}
            key={-1}
            onClick={this.onProviderChange}>
            {"All Providers"}
        </button>
        );
    },
    renderProvider: function(provider) {
        var provider_id = "provider-" + provider.id;
        return (
        <button className="btn btn-default"
            style={{ marginRight: "10px" }}
            id={provider_id}
            key={provider.id}
            onClick={this.onProviderChange}>
            {provider.get("name")}
        </button>
        );
    },
    renderProviderSelect: function() {
        var self = this;
        var providers = stores.ProviderStore.getAll();
        if (!providers) {
            return (<div className="loading" />);
        }
        var providerRows = providers.map(function(provider) {
            return self.renderProvider(provider);
        });
        providerRows.push(self.renderAllProviderRow())
        return (
        <div style={{ marginBottom: "30px" }} className="secondary-nav-links">
            {providerRows}
        </div>
        );
    },
    launchNewAccountModal: function() {
        modals.AccountModals.create();
    },
    launchNewProviderModal: function() {
        modals.ProviderModals.create();
    },
    newIdentityDisabled: function() {
        var providers = stores.ProviderStore.getAll();
        if (!providers || providers.length == 0) {
            return true;
        }
        return false;
    },

    render: function() {
        return (
        <div className="resource-master">
            <div id="create-container">
                <div className="pull-right">
                    <button className="btn btn-primary"
                            style={{marginBottom: "10px"}}
                            onClick={this.launchNewProviderModal}>
                        Create New Provider
                    </button>
                    <button className="btn btn-primary"
                            style={{marginBottom: "10px", marginLeft: "10px"}}
                            disabled={this.newIdentityDisabled()}
                            onClick={this.launchNewAccountModal}>
                        Create New Account
                    </button>
                </div>
            </div>
            <div id="membership-container">
                <input type="text"
                    className="form-control search-input"
                    placeholder="Search for a specific user by username"
                    onChange={this.onSearchChange}
                    value={this.state.query}
                    ref="textField" />
            </div>
            {this.renderProviderSelect()}
            <h3 className="t-title">Identities</h3>
            {this.renderTable()}
        </div>
        );
    }

});
