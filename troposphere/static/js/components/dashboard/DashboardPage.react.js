/** @jsx React.DOM */

define(
  [
    'react',
    'stores',
    './DashboardView.react'
  ],
  function (React, stores, DashboardView) {

    function getState() {
        return {
          providers: stores.ProviderStore.getAll(),
          identities: stores.IdentityStore.getAll(),
          projects: stores.ProjectStore.getAll(),
          maintenanceMessages: stores.MaintenanceMessageStore.getAll(),
          applications: stores.ApplicationStore.getAll()
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
        if (this.isMounted()) this.setState(getState());
      },

      componentDidMount: function () {
        stores.ProviderStore.addChangeListener(this.updateState);
        stores.IdentityStore.addChangeListener(this.updateState);
        stores.SizeStore.addChangeListener(this.updateState);
        stores.InstanceStore.addChangeListener(this.updateState);
        stores.ProjectStore.addChangeListener(this.updateState);
        stores.VolumeStore.addChangeListener(this.updateState);
        stores.InstanceHistoryStore.addChangeListener(this.updateState);
        stores.MaintenanceMessageStore.addChangeListener(this.updateState);
        stores.ApplicationStore.addChangeListener(this.updateState);
      },

      componentWillUnmount: function() {
        stores.ProviderStore.removeChangeListener(this.updateState);
        stores.IdentityStore.removeChangeListener(this.updateState);
        stores.SizeStore.removeChangeListener(this.updateState);
        stores.InstanceStore.removeChangeListener(this.updateState);
        stores.ProjectStore.removeChangeListener(this.updateState);
        stores.VolumeStore.removeChangeListener(this.updateState);
        stores.InstanceHistoryStore.removeChangeListener(this.updateState);
        stores.MaintenanceMessageStore.removeChangeListener(this.updateState);
        stores.ApplicationStore.removeChangeListener(this.updateState);
      },

      //
      // Render
      // ------
      //

      render: function () {
        var providers = this.state.providers;
        var identities = this.state.identities;
        var projects = this.state.projects;
        var maintenanceMessages = this.state.maintenanceMessages;
        var applications = this.state.applications;

        if (providers && identities && projects && maintenanceMessages && applications) {
          var instances = stores.InstanceStore.getAll(projects);
          var volumes = stores.VolumeStore.getAll(projects);

          return (
            <DashboardView providers={providers}
                           identities={identities}
                           instances={instances}
                           volumes={volumes}
                           maintenanceMessages={maintenanceMessages}
                           applications={applications}
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
