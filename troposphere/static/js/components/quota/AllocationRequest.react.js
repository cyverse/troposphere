define(function (require) {
  "use strict";

  var React = require('react'),
      Backbone = require('backbone'),
      Router = require('react-router'),
      stores = require('stores'),
      AllocationAdmin = require('./AllocationAdmin.react'),
      RouteHandler = Router.RouteHandler;

  return React.createClass({

    propTypes: {
      request: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    render: function () {
      var request = this.props.request;
      return (
          <tr>
              <td className="user-name">
                <Router.Link to="allocation-request" params={{allocationRequestId: request.id}}>
                  {request.get('user').username}
                </Router.Link>
              </td>
              <td className="request">{request.get('request')}</td>
              <td className="description">{request.get('description')}</td>
          </tr>
      );
    }


  });

});
