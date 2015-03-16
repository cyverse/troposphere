define(function (require) {
  "use strict";

  var React = require('react'),
      Router = require('react-router'),
      stores = require('stores'),
      QuotaAdmin = require('./QuotaAdmin.react'),
      RouteHandler = Router.RouteHandler;

  return React.createClass({

    openActions: function(id){
        console.log(this);
    },

    handleClick: function() {
        //Router.getInstance().transitionTo("quota-request", {quotaRequestId: this.props.id});
    },

    render: function () {
      var id = this.props.id;
      var request = stores.QuotaRequestStore.get(id);

      if(!request) return <div className="loading"></div>;

      var jsonRequest = request.toJSON();
      return (
          <tr>
              <td className="user-name">
                <Router.Link to="quota-request" params={{quotaRequestId: request.id}}>
                  {jsonRequest['created_by']}
                </Router.Link>
              </td>
              <td className="status">{jsonRequest['status']}</td>
              <td className="quota-admin-message">{jsonRequest['admin_message']}</td>
              <td className="quota">{jsonRequest['quota']}</td>
              <td className="request">{jsonRequest['request']}</td>
              <td className="description">{jsonRequest['description']}</td>
          </tr>
      );
    }


  });

});