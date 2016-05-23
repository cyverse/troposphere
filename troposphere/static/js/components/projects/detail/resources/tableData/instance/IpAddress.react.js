import React from 'react';
import Backbone from 'backbone';

export default React.createClass({
      displayName: "IpAddress",

      propTypes: {
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      render: function () {
        var instance = this.props.instance;

        var address = instance.get('ip_address');

        if (!address || address.charAt(0) == "0") {
            address = "N/A";
        }

        return (
          <span>{address}</span>
        );
      }
});
