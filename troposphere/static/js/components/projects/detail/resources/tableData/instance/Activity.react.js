import React from 'react';
import Backbone from 'backbone';

var Activity = React.createClass({
      displayName: "Activity",

      propTypes: {
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      render: function () {
        var instance = this.props.instance,
            stylez = {
                textTransform: "capitalize"
            },
            activity = instance.get('state').get('activity') || "N/A";

        return (
          <span style={stylez}>{activity}</span>
        );
      }
});

export default Activity;
