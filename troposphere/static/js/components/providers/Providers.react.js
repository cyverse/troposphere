/** @jsx React.DOM */

define(
  [
    'react',
    'components/common/PageHeader.react',
    'stores/providers',
    'stores/IdentityStore',
    'actions/ProviderActions',
    'components/providers/Provider.react'
  ],
  function (React, PageHeader, ProviderStore, IdentityStore, ProviderActions, Provider) {

    function getProviderState() {
      var state = {
        providers: ProviderStore.getAll(),
        identities: IdentityStore.getAll()
      };
      if (state.identities) {
        state.identities = state.identities.groupBy(function (model) {
          return model.get('provider_id');
        });
      }
      return state;
    }

    return React.createClass({

      getInitialState: function() {
        return getProviderState();
      },

      updateProviders: function() {
        if (this.isMounted())
          this.setState(getProviderState());
      },

      componentDidMount: function() {
        ProviderStore.addChangeListener(this.updateProviders);
        IdentityStore.addChangeListener(this.updateProviders);
        ProviderActions.fetchAll();
      },

      componentDidUnmount: function() {
        ProviderStore.removeChangeListener(this.updateProviders);
        IdentityStore.removeChangeListener(this.updateProviders);
      },

      render: function () {
        var providers = this.state.providers;

        var items = providers.map(function (model) {
          var identities;
          if (this.state.identities)
            identities = this.state.identities[model.id];

          return (<Provider provider={model} identities={identities} />);
        }.bind(this));

        return (
          <div>
            <PageHeader title="Cloud Providers"/>
            {items}
          </div>
        );
      }

    });

  });
