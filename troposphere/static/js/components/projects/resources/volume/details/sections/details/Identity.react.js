/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'components/projects/common/ResourceDetail.react'
  ],
  function (React, Backbone, ResourceDetail) {

    return React.createClass({

      propTypes: {
        volume: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        provider: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      render: function () {
        var providerName = this.props.provider.get('name');

        return (
          <ResourceDetail label="Provider">
            {providerName}
          </ResourceDetail>
        );
      }

    });

  });
