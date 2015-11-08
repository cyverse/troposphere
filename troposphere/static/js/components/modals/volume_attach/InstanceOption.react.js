import React from 'react';
import Backbone from 'backbone';

export default React.createClass({
      displayName: "InstanceOption",

      propTypes: {
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      render: function () {
        return (
          <option value={this.props.instance.id}>
            {this.props.instance.get('name')}
          </option>
        );
      }
});
