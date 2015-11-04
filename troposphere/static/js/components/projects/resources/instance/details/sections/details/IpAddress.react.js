
define(
  [
    'react',
    'backbone',
    'components/projects/common/ResourceDetail.react'
  ],
  function (React, Backbone, ResourceDetail) {

    return React.createClass({
      displayName: "IpAddress",

      propTypes: {
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      render: function () {
        return (
          <ResourceDetail label="IP Address">
            {this.props.instance.get('ip_address')}
          </ResourceDetail>
        );
      }

    });

  });
