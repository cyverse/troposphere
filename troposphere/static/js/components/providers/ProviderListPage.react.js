/** @jsx React.DOM */

define(
  [
    'react',
    'stores/ProviderStore',
    'stores/IdentityStore',
    'stores/ProjectStore',
    'stores/InstanceStore',
    'stores/VolumeStore',
    './ProviderListView.react'
  ],
  function (React, ProviderStore, IdentityStore, ProjectStore, InstanceStore, VolumeStore, ProviderListView) {

    function getState() {
      return {
        providers: ProviderStore.getAll(),
        identities: IdentityStore.getAll(),
        projects: ProjectStore.getAll()
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
        ProjectStore.addChangeListener(this.updateState);
        InstanceStore.addChangeListener(this.updateState);
        VolumeStore.addChangeListener(this.updateState);
      },

      componentWillUnmount: function () {
        ProviderStore.removeChangeListener(this.updateState);
        IdentityStore.removeChangeListener(this.updateState);
        ProjectStore.removeChangeListener(this.updateState);
        InstanceStore.removeChangeListener(this.updateState);
        VolumeStore.removeChangeListener(this.updateState);
      },

      render: function () {
        var providers = this.state.providers;
        var identities = this.state.identities;
        var projects = this.state.projects;

        if (providers && identities && projects) {
          var instances = InstanceStore.getAll(projects);
          var volumes = VolumeStore.getAll(projects);

          return (
            <ProviderListView providers={providers}
                              identities={identities}
                              instances={instances}
                              volumes={volumes}
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
