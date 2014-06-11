/** @jsx React.DOM */

define(
  [
    'react',
    'stores/ProviderStore',
    'stores/IdentityStore',
    './ProviderListView.react'
  ],
  function (React, ProviderStore, IdentityStore, ProviderListView) {

    function getState() {
      return {
        providers: ProviderStore.getAll(),
        identities: IdentityStore.getAll()
      };
    }

    return React.createClass({

      getInitialState: function () {
        return getState();
      },

      updateState: function () {
        if (this.isMounted()) this.setState(getState());
      },

      componentDidMount: function () {
        ProviderStore.addChangeListener(this.updateState);
        IdentityStore.addChangeListener(this.updateState);
      },

      componentDidUnmount: function () {
        ProviderStore.removeChangeListener(this.updateState);
        IdentityStore.removeChangeListener(this.updateState);
      },

      render: function () {
        if (this.state.providers && this.state.identities) {
          return (
            <ProviderListView providers={this.state.providers}
                              identities={this.state.identities}
            />
          );
        }else {
          return (
            <div className='loading'></div>
          );
        }
      }

    });

  });
