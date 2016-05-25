import React from 'react';
import Backbone from 'backbone';

export default React.createClass({
      displayName: "InstanceNotRealRow",

      propTypes: {
        project: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      render: function () {
        var instance = this.props.instance;

        return (
          <tr className="not-real-resource-row">
            <td></td>
            <td>
              <span>{instance.get('name')}</span>
            </td>
            <td>
              INSTANCE IS NOT REAL
            </td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        );
      }
});
