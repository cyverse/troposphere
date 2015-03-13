define(function (require) {
  "use strict";

  var React = require('react'),
      Router = require('react-router'),
      stores = require('stores'),
      RouteHandler = Router.RouteHandler;

  return React.createClass({

    mixins: [Router.State],

    render: function () {
      var quotaRequests = stores.QuotaRequestStore.getAll();

      if(!quotaRequests) return <div className="loading"></div>;

      var jsonRequests = quotaRequests.toJSON();

      return (
        <div>
            <h1>Quota Requests!</h1>
            <div>
                <table>
                    <tr class = >
                        <th>
                            <h3>User</h3>
                        </th>
                        <th>
                            <h3>Status</h3>
                        </th>
                        <th>
                            <h3>Quota</h3>
                        </th>
                        <th>
                            <h3>Request</h3>
                        </th>
                        <th>
                            <h3>Description</h3>
                        </th>
                    </tr>
                    {jsonRequests.map(function(item){
                    return(
                        <tr>
                            <td className = "user-name">{item['created_by']}</td>
                            <td className = "status">{item['status']}</td>
                            <td className = "quota">{item['quota']}</td>
                            <td className = "request">{item['request']}</td>
                            <td className = "description">{item['description']}</td>
                        </tr>
                    );
                    })}
                </table>
            </div>
            <RouteHandler/>
        </div>
      );
    }

  });

});