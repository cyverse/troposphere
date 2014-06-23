/** @jsx React.DOM */

define(
  [
    'react',
    'stores/ProviderStore',
    'stores/IdentityStore',
    'stores/SizeStore',
    './DashboardView.react'
  ],
  function (React, ProviderStore, IdentityStore, SizeStore, DashboardView) {

    function getState(applicationId) {
        return {
          providers: ProviderStore.getAll(),
          identities: IdentityStore.getAll()
        };
    }

    return React.createClass({

      //
      // Mounting & State
      // ----------------
      //

      getInitialState: function() {
        return getState();
      },

      updateState: function() {
        if (this.isMounted()) this.setState(getState())
      },

      componentDidMount: function () {
        ProviderStore.addChangeListener(this.updateState);
        IdentityStore.addChangeListener(this.updateState);
        SizeStore.addChangeListener(this.updateState);
      },

      componentWillUnmount: function() {
        ProviderStore.removeChangeListener(this.updateState);
        IdentityStore.removeChangeListener(this.updateState);
        SizeStore.removeChangeListener(this.updateState);
      },

      //
      // Render
      // ------
      //

      render: function () {
        var providers = this.state.providers;
        var identities = this.state.identities;

        if (providers && identities) {
          return (
            <DashboardView providers={providers} identities={identities}/>
          );
        }else{
          return (
            <div className='loading'></div>
          );
        }
      }

    });

  });
