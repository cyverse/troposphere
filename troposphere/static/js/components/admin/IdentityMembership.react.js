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
      var provider_str =  membership.get('provider').name;
      if(membership.get('provider').active == false) {
          provider_str = provider_str + " - Inactive"
      } else if(membership.get('provider').end_date) {
          provider_str = provider_str + " - Inactive as of " + membership.get('provider').end_date;
      }
      return (
        <tr>
          <td className="user-name">{membership.get('user').username}</td>
          <td className="provider">{provider_str}</td>
          <td className="end-date">{membership.get('end_date') !== null ? "Disabled as of "+membership.get('end_date') : "Enabled"}</td>
        </tr>
      );
    }


  });

});
