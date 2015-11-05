import React from 'react/addons';
import Router from 'react-router';
import stores from 'stores';
import ResourceAdmin from './ResourceAdmin.react';
import ResourceRequest from './ResourceRequest.react';

let RouteHandler = Router.RouteHandler;

export default React.createClass({

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
            <table className="admin-table table table-hover col-md-6">
              <tbody>
                <tr className="admin-row">
                  <th className="center">
                      <h3>User</h3>
                  </th>
                  <th className="center">
                      <h3>Request</h3>
                  </th>
                  <th className="center">
                      <h3>Description</h3>
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
