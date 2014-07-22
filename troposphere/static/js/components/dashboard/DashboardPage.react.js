/** @jsx React.DOM */

define(
  [
    'react',
    'stores/ProviderStore',
    'stores/IdentityStore',
    'stores/SizeStore',
    'stores/InstanceStore',
    'stores/VolumeStore',
    'stores/InstanceHistoryStore',
    'stores/MaintenanceMessageStore',
    './DashboardView.react'
  ],
  function (React, ProviderStore, IdentityStore, SizeStore, InstanceStore, VolumeStore, InstanceHistoryStore, MaintenanceMessageStore, DashboardView) {

    function getState() {
        return {
          providers: ProviderStore.getAll(),
          identities: IdentityStore.getAll(),
          instances: InstanceStore.getAll(),
          volumes: VolumeStore.getAll(),
          maintenanceMessages: MaintenanceMessageStore.getAll()
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
        InstanceStore.addChangeListener(this.updateState);
        VolumeStore.addChangeListener(this.updateState);
        InstanceHistoryStore.addChangeListener(this.updateState);
        MaintenanceMessageStore.addChangeListener(this.updateState);
      },

      componentWillUnmount: function() {
        ProviderStore.removeChangeListener(this.updateState);
        IdentityStore.removeChangeListener(this.updateState);
        SizeStore.removeChangeListener(this.updateState);
        InstanceStore.removeChangeListener(this.updateState);
        VolumeStore.removeChangeListener(this.updateState);
        InstanceHistoryStore.removeChangeListener(this.updateState);
        MaintenanceMessageStore.removeChangeListener(this.updateState);
      },

      //
      // Render
      // ------
      //

      render: function () {
        var providers = this.state.providers;
        var identities = this.state.identities;
        var instances = this.state.instances;
        var volumes = this.state.volumes;
        var maintenanceMessages = this.state.maintenanceMessages;

        if (providers && identities && instances && volumes && maintenanceMessages) {
          return (
            <DashboardView providers={providers}
                           identities={identities}
                           instances={instances}
                           volumes={volumes}
                           maintenanceMessages={maintenanceMessages}
            />
          );
        }else{
          return (
            <div className='loading'></div>
          );
        }
      }

    });

  });
