/** @jsx React.DOM */

define(
  [
    'react',
    'components/common/PageHeader.react',
    'components/providers/Provider.react',
    './ProviderListHeader.react'
  ],
  function (React, PageHeader, Provider, ProviderListHeader) {

    return React.createClass({

      propTypes: {
        providers: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        identities: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      render: function () {
          var providers = this.props.providers.map(function (provider) {

            // Get the identities belonging to this provider and cast as the original collection
            // type (which should be IdentityCollection)
            var providerIdentityArray = this.props.identities.where({'provider_id': provider.id});
            var providerIdentities = new this.props.identities.constructor(providerIdentityArray);

            return (
              <Provider provider={provider}
                        identities={providerIdentities}
              />
            );
          }.bind(this));

          return (
            <div>
              <ProviderListHeader title={this.props.providers.length + " Cloud Providers"}/>
              <div className="container">
                {providers}
              </div>
            </div>
          );

      }

    });

  });
