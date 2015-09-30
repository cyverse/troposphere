define(function (require) {
  "use strict";

  var React = require('react/addons'),
    Backbone = require('backbone'),
    Router = require('react-router'),
    stores = require('stores');

  return React.createClass({

    propTypes: {
      membership: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    render: function () {
      var membership = this.props.membership;
      return (
        <tr>
          <td className="user-name">{membership.get('user').username}</td>
          <td className="provider">{membership.get('provider').name}</td>
          <td className="end-date">{membership.get('end_date') !== null ? "Disabled" : "Enabled"}</td>
        </tr>
      );
    }


  });

});
