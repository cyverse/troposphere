import React from 'react';
import Backbone from 'backbone';

export default React.createClass({
      displayName: "Size",

      propTypes: {
        volume: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      render: function () {
        return (
          <span>{this.props.volume.get('size') + " GB"}</span>
        );
      }
});
