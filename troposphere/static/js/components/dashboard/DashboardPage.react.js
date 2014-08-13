/** @jsx React.DOM */

define(
  [
    'react',
    'stores/ProviderStore',
    'stores/IdentityStore',
    'stores/SizeStore',
    'stores/ProjectStore',
    'stores/InstanceStore',
    'stores/VolumeStore',
    'stores/InstanceHistoryStore',
    'stores/MaintenanceMessageStore',
    './DashboardView.react',
    'context',
    'actions/NullProjectActions'
  ],
  function (React, ProviderStore, IdentityStore, SizeStore, ProjectStore, InstanceStore, VolumeStore, InstanceHistoryStore, MaintenanceMessageStore, DashboardView, context, NullProjectActions) {

    function getState() {
        return {
          providers: ProviderStore.getAll(),
          identities: IdentityStore.getAll(),
          projects: ProjectStore.getAll(),
          maintenanceMessages: MaintenanceMessageStore.getAll()
          // todo: fetch instances and volumes not in a project
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
        ProviderStore.addChangeListener(this.updateState);
        IdentityStore.addChangeListener(this.updateState);
        SizeStore.addChangeListener(this.updateState);
        InstanceStore.addChangeListener(this.updateState);
        ProjectStore.addChangeListener(this.updateState);
        VolumeStore.addChangeListener(this.updateState);
        InstanceHistoryStore.addChangeListener(this.updateState);
        MaintenanceMessageStore.addChangeListener(this.updateState);

        if(!context.nullProject.isEmpty()){
          NullProjectActions.migrateResourcesIntoProject(context.nullProject);
        }
      },

      componentWillUnmount: function() {
        ProviderStore.removeChangeListener(this.updateState);
        IdentityStore.removeChangeListener(this.updateState);
        SizeStore.removeChangeListener(this.updateState);
        InstanceStore.removeChangeListener(this.updateState);
        ProjectStore.removeChangeListener(this.updateState);
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
        var projects = this.state.projects;
        var maintenanceMessages = this.state.maintenanceMessages;

        if (providers && identities && projects && maintenanceMessages) {
          var instances = InstanceStore.getAll(projects);
          var volumes = VolumeStore.getAll(projects);

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
