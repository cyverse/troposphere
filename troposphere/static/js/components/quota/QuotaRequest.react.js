define(function (require) {
  "use strict";

  var React = require('react'),
      Router = require('react-router'),
      stores = require('stores'),
      QuotaAdmin = require('./QuotaAdmin.react'),
      RouteHandler = Router.RouteHandler;

  return React.createClass({

    render: function () {
      var id = this.props.id;
      var requests = this.props.requests;
      var request = requests.get(id);

      if(!request) return <div className="loading"></div>;
      
      return (
          <tr>
              <td className="user-name">
                <Router.Link to="quota-request" params={{quotaRequestId: request.id}}>
                  {request.attributes.created_by}
                </Router.Link>
              </td>
              <td className="quota-admin-message">{request.attributes.admin_message}</td>
              <td className="quota">{request.attributes.quota}</td>
              <td className="request">{request.attributes.request}</td>
              <td className="description">{request.attributes.description}</td>
          </tr>
      );
    }


  });

});