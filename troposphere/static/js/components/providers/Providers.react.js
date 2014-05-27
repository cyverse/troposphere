/** @jsx React.DOM */

define(
  [
    'react',
    'components/common/PageHeader.react',
    'stores/providers'
  ],
  function (React, PageHeader, ProviderStore) {

    function getProviderState() {
      return {
        providers: ProviderStore.getAll()
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
      },

      componentDidUnmount: function() {
        ProviderStore.removeChangeListener(this.updateProviders);
      },

      render: function () {
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
