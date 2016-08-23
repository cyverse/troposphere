import React from 'react';
import Backbone from 'backbone';
import Instance from 'models/Instance';
import Volume from 'models/Volume';

export default React.createClass({
      displayName: "ResourceListItem",

      propTypes: {
        resource: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      render: function () {
        var resource = this.props.resource;

        if (resource instanceof Instance) {
          return (
            <li>
              <strong>{"Instance: "}</strong>
              {resource.get('name')}
            </li>
          )
        } else if (resource instanceof Volume) {
          return (
            <li>
              <strong>{"Volume: "}</strong>
              {resource.get('name')}
            </li>
          )
        } else {
          return (
            <li>{resource.get('name')}</li>
          )
        }
      }
});
