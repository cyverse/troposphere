define(function (require) {
  "use strict";

  var React = require('react'),
      Router = require('react-router'),
      stores = require('stores'),
      QuotaRequest = require('./QuotaRequest.react'),
      RouteHandler = Router.RouteHandler;

  return React.createClass({

    mixins: [Router.State],

    render: function () {
      var requests = stores.QuotaRequestStore.getAll();

      if(!requests) return <div className="loading"></div>;

      return (
        <div className = "container">
            <h1>Quota Requests</h1>
            <div className="quota-inline">
                <table onUpdate = {this.onUpdate} className="quota-table table table-hover">
                    <tr className = "quota-row">
                        <th className="center">
                            <h3>User</h3>
                        </th>
                        <th className="center">
                            <h3>Admin Message</h3>
                        </th>
                        <th className="center">
                            <h3>Quota</h3>
                        </th>
                        <th className="center">
                            <h3>Request</h3>
                        </th>
                        <th className="center">
                            <h3>Description</h3>
                        </th>
                    </tr>
                    {requests.map(function(item){
                      var id = item.id;
                      return(
                        <QuotaRequest id = {id} requests = {requests} />
                      );
                    })}
                </table>
              <RouteHandler/>
            </div>
        </div>
      );
    }

  });

});