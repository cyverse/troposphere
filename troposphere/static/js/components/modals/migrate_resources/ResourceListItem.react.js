
define(
  [
    'react',
    'backbone',
    'models/Instance',
    'models/Volume'
  ],
  function (React, Backbone, Instance, Volume) {

    return React.createClass({
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

  });
