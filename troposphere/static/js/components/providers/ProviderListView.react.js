/** @jsx React.DOM */

define(
  [
    'react',
    'components/common/PageHeader.react',
    'components/providers/Provider.react'
  ],
  function (React, PageHeader, Provider) {

    return React.createClass({

      propTypes: {
        providers: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        identities: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      render: function () {
          var providers = this.props.providers.map(function (provider) {
            var providerIdentities = this.props.identities.where({'provider_id': provider.id});

            return (
              <Provider provider={provider}
                        identities={providerIdentities}
              />
            );
          }.bind(this));

          return (
            <div>
              <PageHeader title="Cloud Providers"/>
              {providers}
            </div>
          );

      }

    });

  });
