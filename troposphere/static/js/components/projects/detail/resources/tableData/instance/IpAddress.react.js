import React from 'react';
import Backbone from 'backbone';

export default React.createClass({
      displayName: "IpAddress",

      propTypes: {
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      render: function () {
        var instance = this.props.instance;

        return (
          <span>{instance.get('ip_address')}</span>
        );
      }
});
