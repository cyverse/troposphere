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
      var requests = stores.QuotaRequestStore.getAll(),
          quotaRequestRows;

      if(!requests) return <div className="loading"></div>;

      //if(requests.length > 1){
      // quotaRequestRows = requests.map(function(request){
      //    return(
      //      <QuotaRequest key={request.id} request={request}/>
      //    );
      //  });
      //}else{
      //  quotaRequestRows = <QuotaRequest key={requests.at(0).id} request={requests.at(0)}/>
      //}
      var quotaRequestRows = requests.map(function(request) {
        return(
          <QuotaRequest key={request.id} request = {request} />
        )
      });

      return (
        <div className = "container">
            <h1>Quota Requests</h1>
            <div className="quota-inline">
                <table className="quota-table table table-hover">
                  <tbody>
                    <tr className="quota-row">
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
                    {quotaRequestRows}
                    </tbody>
                </table>
              <RouteHandler/>
            </div>
        </div>
      );
    }

  });

});