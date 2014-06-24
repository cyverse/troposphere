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
        /*
          Summary of resources in use (sorted by provider/identity?) incl. Instances, Volumes,
          and a simplified quota representation (?). I imagine they'll be able to click on these
          to see details for cloud resources or click on the provider or the quota to see that provider.
         */

        var providerSummaries = this.props.providers.map(function (provider) {
          if(true){
            return (
              <ResourceSummary key={provider.id}
                               provider={provider}
                               identities={this.props.identities}
                               instances={this.props.instances}
                               volumes={this.props.volumes}
              />
            );
          }else{
            return (
              <div className='loading'></div>
            );
          }
        }.bind(this));

        return (
          <div className="">
            <h2>Resource Summary</h2>
            {providerSummaries}
          </div>
        );
      }

    });

  });
