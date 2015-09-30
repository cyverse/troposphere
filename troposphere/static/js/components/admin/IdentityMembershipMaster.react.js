define(function (require) {
  "use strict";

  var React = require('react/addons'),
    Router = require('react-router'),
    stores = require('stores'),
    IdentityMembership = require('./IdentityMembership.react');
  var timer,
    timerDelay = 100;


  return React.createClass({
    displayName: "IdentityMembership",
    mixins: [Router.State],
    getInitialState: function() {
        return {
            query: "",
            selectedProviderId: -1,
            allModels: null,
        };
    },

    componentDidMount: function () {
      stores.IdentityMembershipStore.addChangeListener(this.updateState);
      stores.ProviderStore.addChangeListener(this.updateState);
    },

    componentWillUnmount: function() {
      stores.IdentityMembershipStore.removeChangeListener(this.updateState);
      stores.ProviderStore.removeChangeListener(this.updateState);
    },

    //Borrowed shamelessly from ImageListView
    handleSearch: function (input) {
      if (timer) clearTimeout(timer);

      timer = setTimeout(function () {
        this.setState({query: this.state.query});
      }.bind(this), timerDelay);
    },

    onProviderChange: function (e) {
      var provider_key = e.target.id,
          provider_id = provider_key.split('-')[1];
      this.setState({selectedProviderId: provider_id});
    },

    onSearchChange: function (e) {
      var input = e.target.value;
      this.setState({query: input});
      this.handleSearch(input);
    },


    renderTable: function () {
      var memberships;
     var query_params = {};
      if(this.state.query !== null && this.state.query !== "") {
          query_params.query = this.state.query
      }
      if(this.state.selectedProviderId != -1) {
          query_params.provider_id = this.state.selectedProviderId;
      }
      if(query_params) {
          memberships = stores.IdentityMembershipStore.fetchWhere(query_params);
      } else {
          memberships = stores.IdentityMembershipStore.getAll();
      }

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
          <table className="admin-table table table-hover col-md-6">
            <tbody>
              <tr className="admin-row">
                <th className="center">
                    <h3>User</h3>
                </th>
                <th className="center">
                    <h3>Provider</h3>
                </th>
                <th className="center">
                    <h3>Enabled/Disabled</h3>
                </th>
              </tr>
              {identityMembershipRows}
            </tbody>
          </table>
        );
    },
    renderProvider: function(provider) {
          var provider_id = "provider-"+provider.id;
          return (
            <button className="btn btn-default" id={provider_id} key={provider.id} onClick={this.onProviderChange}>
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
        return (<div className="container">
              <div className="secondary-nav-links">
                {providerRows}
              </div>
            </div>);

    },
    render: function () {
      return (
        <div className="resource-master container">
          <h1>Atmosphere Users</h1>
          <div id='membership-container'>
            <input
            type='text'
            className='form-control search-input'
            placeholder='Search for a specific user by username'
            onChange={this.onSearchChange}
            value={this.state.query}
            ref="textField"
            />
            <hr/>
          </div>
          {this.renderProviderSelect()}
          {this.renderTable()}
        </div>
      );
    }

  });

});
