define(function (require) {
  "use strict";

  var React = require('react/addons'),
    Router = require('react-router'),
    stores = require('stores'),
    ResourceAdmin = require('./ResourceAdmin.react'),
    ResourceRequest = require('./ResourceRequest.react'),
    RouteHandler = Router.RouteHandler;

  return React.createClass({

    mixins: [Router.State],

    render: function () {
      var requests = stores.ResourceRequestStore.fetchWhere({
          'status__name': 'pending'
        }),
        statuses = stores.StatusStore.getAll();

      if (!requests || !statuses) return <div className="loading"></div>;

      requests = stores.ResourceRequestStore.getAll();

      var resourceRequestRows = requests.map(function (request) {
        return (
          <ResourceRequest key={request.id} request={request}/>
        )
      });

      if (!resourceRequestRows[0]) {
        return  (
                <div>
                 <h3>No resource requests</h3>
                </div>
                );
      
      }

      return (
        <div className="resource-master">
          <h1>Resource Requests</h1>
            <table className="admin-table table table-hover table-striped col-md-6">
              <tbody>
                <tr className="admin-row">
                  <th>
                      <h4>User</h4>
                  </th>
                  <th>
                      <h4>Request</h4>
                  </th>
                  <th>
                      <h4>Description</h4>
                  </th>
                </tr>
                {resourceRequestRows}
              </tbody>
            </table>
            <RouteHandler />
        </div>
      );
    }

  });

});
