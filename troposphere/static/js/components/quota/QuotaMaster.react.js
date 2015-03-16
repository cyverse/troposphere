define(function (require) {
  "use strict";

  var React = require('react'),
      Router = require('react-router'),
      stores = require('stores'),
      QuotaRequest = require('./QuotaRequest.react'),
      RouteHandler = Router.RouteHandler;

  return React.createClass({

    mixins: [Router.State],

    handleClick: function(QuotaRequest){
        console.log("this 1");
    },

    render: function () {
      var requests = stores.QuotaRequestStore.getAll();

      if(!requests) return <div className="loading"></div>;

      var jsonRequests = requests.toJSON();

      return (
        <div className = "container">
            <h1>Quota Requests!</h1>
            <div>
                <table className="table table-hover">
                    <tr className = "quota-row">
                        <th>
                            <h3>User</h3>
                        </th>
                        <th>
                            <h3>Status</h3>
                        </th>
                        <th>
                            <h3>Admin Message</h3>
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
                    var id = item['id'];
                    return(
                        <QuotaRequest id={id} />
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