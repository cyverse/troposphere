/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    './ProviderSummary.react'
  ],
  function (React, Backbone, ProviderSummary) {

    return React.createClass({

      propTypes: {
        providers: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        identities: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        instances: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        volumes: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      render: function () {
        var summaries = this.props.identities.map(function(identity) {
          return (
            <ProviderSummary identity={identity}
                             providers={this.props.providers}
                             instances={this.props.instances}
                             volumes={this.props.volumes}
            />
          );
        }.bind(this));

        var title = "Total Resources in Use";

        return (
          <div className="resource-summary col-md-6">
            <h3>{title}</h3>
            {summaries}
          </div>
        );
      }

    });

  });
