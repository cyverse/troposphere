define(function (require) {
  "use strict";

  var React = require('react/addons'),
    Backbone = require('backbone'),
    Router = require('react-router'),
    stores = require('stores');

  return React.createClass({

    propTypes: {
      request: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    render: function () {
      var request = this.props.request;
      return (
        <tr>
          <td className="user-name">
            <Router.Link to="image-request" params={{imageRequestId: request.id}}>
              {request.get('new_machine_owner').username}
            </Router.Link>
          </td>
          <td className="request">{request.get('new_application_name')}</td>
          <td className="description">{request.get('status').name}</td>
        </tr>
      );
    }


  });

});
