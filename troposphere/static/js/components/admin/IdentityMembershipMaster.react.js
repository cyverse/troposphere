define(function (require) {
  "use strict";

  var React = require('react/addons'),
    Router = require('react-router'),
    stores = require('stores'),
    //IdentityMembershipAdmin = require('./IdentityMembershipAdmin.react'),
    IdentityMembership = require('./IdentityMembership.react'),
    RouteHandler = Router.RouteHandler;

  return React.createClass({
    displayName: "IdentityMembership",
    mixins: [Router.State],
    getInitialState: function() {
        return {
            user_query: "",
        };
    },
    render: function () {
      var memberships = stores.IdentityMembershipStore.getAll();
      //stores.IdentityMembershipStore.fetchWhere({
      //    'username': this.state.user_query
      //  });

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
        <div className="resource-master">
          <h1>Atmosphere Users</h1>
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
            <RouteHandler />
        </div>
      );
    }

  });

});
