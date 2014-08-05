/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    './ProviderSummaryLineChart.react'

  ],
  function (React, Backbone, ProviderSummaryLineChart) {

    return React.createClass({

      propTypes: {
        providers: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        identities: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        instances: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        volumes: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      render: function () {
        return (
          <div>
          </div>
        );
      }

    });

  });
