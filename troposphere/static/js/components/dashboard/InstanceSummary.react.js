/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    './ResourceSummary.react'
  ],
  function (React, Backbone, ResourceSummary) {

    return React.createClass({

      propTypes: {
        providers: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        identities: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        instances: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        volumes: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      render: function () {
        var instanceSummaries = this.props.instances.map(function (instance) {
          return (
            <div key={instance.id}>{"1" + instance.get('status')}</div>
          );
        }.bind(this));

        var instanceTitle = this.props.instances.length + " Instances";

        return (
          <div className="resource-summary">
            <h2>{instanceTitle}</h2>
            {instanceSummaries}
          </div>
        );
      }

    });

  });
