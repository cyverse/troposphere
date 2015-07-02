define(function (require) {
  "use strict";

  var React = require('react'),
      Router = require('react-router'),
      stores = require('stores'),
      ResourceRequest = require('./ResourceRequest.react'),
      RouteHandler = Router.RouteHandler;

  return React.createClass({

    mixins: [Router.State],

    render: function () {
      var requests = stores.QuotaRequestStore.findWhere({
            'status.name': 'pending'
          }),
          statuses = stores.QuotaStatusStore.getAll();

      if(!requests || !statuses) return <div className="loading"></div>;

      if(!requests[0]){
        stores.QuotaRequestStore.fetchMore();
      }
      requests = stores.QuotaRequestStore.findWhere({
            'status.name': 'pending'
          });

      var resourceRequestRows = requests.map(function(request) {
        return(
          <ResourceRequest key={request.id} request={request} />
        )
      });

      return (
        <div className = "container">
            <h1>Resource Requests</h1>
            <div>
                <table className="quota-table table table-hover col-md-6">
                  <tbody>
                    <tr className="quota-row">
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
              <RouteHandler/>
            </div>
        </div>
      );
    }

  });

});