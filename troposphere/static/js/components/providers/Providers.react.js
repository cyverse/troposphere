/** @jsx React.DOM */

define(
  [
    'react',
    'components/common/PageHeader.react',
    'stores/providers',
    'stores/identities',
    'actions/providers',
    'actions/identities'
  ],
  function (React, PageHeader, ProviderStore, IdentityStore, ProviderActions, IdentityActions) {

    function getProviderState() {
      return {
        providers: ProviderStore.getAll(),
        identities: IdentityStore.getAll()
      };
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
        IdentityActions.fetchAll();
      },

      componentDidUnmount: function() {
        ProviderStore.removeChangeListener(this.updateProviders);
        IdentityStore.removeChangeListener(this.updateProviders);
      },

      render: function () {
        console.log(this.state);
        var providers = this.state.providers;

        var items = providers.map(function (model) {
          return [
            <h2>{model.get('location')}</h2>,
            <p>{model.get('description')}</p>
          ];
        });

        return (
          <div>
            <PageHeader title="Cloud Providers"/>
            {items}
          </div>
        );
      }

    });

  });
