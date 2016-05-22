define(function (require) {
  "use strict";

  var React = require('react/addons'),
    Router = require('react-router'),
    stores = require('stores'),
    IdentityMembership = require('./IdentityMembership.react'),
    ComponentHandleInputWithDelay = require('components/mixins/ComponentHandleInputWithDelay');

  return React.createClass({
    displayName: "IdentityMembership",
    mixins: [Router.State, ComponentHandleInputWithDelay],
    getInitialState: function() {
        return {
            query: "",
            selectedProviderId: -1,
            memberships: null,
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

        this.setState({ memberships });
    },

    componentDidMount: function () {
      stores.IdentityMembershipStore.addChangeListener(this.updateState);
      stores.ProviderStore.addChangeListener(this.updateState);
    },

    componentWillUnmount: function() {
      stores.IdentityMembershipStore.removeChangeListener(this.updateState);
      stores.ProviderStore.removeChangeListener(this.updateState);
    },

    onProviderChange: function (e) {
      var provider_key = e.target.id,
          provider_id = provider_key.split('-')[1];
    
      if (provider_id === 'all') {
          provider_id = -1
      }
      this.setState({selectedProviderId: provider_id});
    },

     onSearchChange: function (e) {
         // TODO: trim all these inputs yo
         var input = e.target.value.trim();
         this.setState({query: input}, () => {
             this.callIfNotInterruptedAfter(500 /* ms */, this.updateState);
         });
     },

    renderTable: function () {
      let memberships = this.state.memberships;

      if (!memberships) return <div className="loading"></div>;

      var identityMembershipRows = memberships.map(function (membership) {
        return (
          <IdentityMembership key={membership.id} membership={membership}/>
        )
      });

      if (!identityMembershipRows[0]) {
        return  (
                <div>
                 <h3>No IdentityMemberships were returned from the API</h3>
                </div>
                );
      }
      return (
          <table className="admin-table table table-striped table-hover" style={{marginTop: "20px"}}>
            <tbody>
              <tr className="admin-row">
                <th>
                    <h4>User</h4>
                </th>
                <th>
                    <h4>Provider</h4>
                </th>
                <th>
                    <h4>Enabled/Disabled</h4>
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
            <button className="btn btn-default" style={{marginRight: "10px"}} id={provider_id} key={-1} onClick={this.onProviderChange}>
                {"All Providers"}
            </button>
          );
    },
    renderProvider: function(provider) {
          var provider_id = "provider-"+provider.id;
          return (
            <button className="btn btn-default" style={{marginRight: "10px"}} id={provider_id} key={provider.id} onClick={this.onProviderChange}>
                {provider.get('name')}
            </button>
          );
    },
    renderProviderSelect: function () {
        var self = this;
        var providers = stores.ProviderStore.getAll();
        if (!providers) {
            return (<div className="loading"/>);
        }
        var providerRows = providers.map(function (provider) {
          return self.renderProvider(provider);
        });
        providerRows.push(self.renderAllProviderRow())
        return (
            <div className="secondary-nav-links">
                {providerRows}
            </div>
        );
    },
    render: function () {
      return (
        <div className="resource-master">
          <div id='membership-container'>
            <input
            type='text'
            className='form-control search-input'
            placeholder='Search for a specific user by username'
            onChange={this.onSearchChange}
            value={this.state.query}
            ref="textField"
            />
          </div>
          {this.renderProviderSelect()}
          <h3>Identities</h3>
          {this.renderTable()}
        </div>
      );
    }

  });

});
