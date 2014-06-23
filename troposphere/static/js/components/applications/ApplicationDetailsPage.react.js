/** @jsx React.DOM */

define(
  [
    'react',
    'stores/ApplicationStore',
    'stores/ProviderStore',
    'stores/IdentityStore',
    'stores/MachineStore',
    './detail/ApplicationDetailsView.react'
  ],
  function (React, ApplicationStore, ProviderStore, IdentityStore, MachineStore, ApplicationDetailsView) {

    function getState(applicationId) {
        return {
          application: ApplicationStore.get(applicationId),
          providers: ProviderStore.getAll(),
          identities: IdentityStore.getAll()
        };
    }

    return React.createClass({

      //
      // Mounting & State
      // ----------------
      //

      propTypes: {
        applicationId: React.PropTypes.string.isRequired
      },

      getInitialState: function() {
        return getState(this.props.applicationId);
      },

      updateState: function() {
        if (this.isMounted()) this.setState(getState(this.props.applicationId))
      },

      componentDidMount: function () {
        ApplicationStore.addChangeListener(this.updateState);
        ProviderStore.addChangeListener(this.updateState);
        IdentityStore.addChangeListener(this.updateState);

        // todo: MachineStore is only included here because
        // MachineStore.get(providerId, identityId, machineId) called by versions/MachineList
        // is lazy loaded, so I need to re-trigger the render cycle when the machine data
        // returns from the server.
        MachineStore.addChangeListener(this.updateState);
      },

      componentWillUnmount: function() {
        ApplicationStore.removeChangeListener(this.updateState);
        ProviderStore.removeChangeListener(this.updateState);
        IdentityStore.removeChangeListener(this.updateState);
        MachineStore.removeChangeListener(this.updateState);
      },

      //
      // Render
      // ------
      //

      render: function () {
        var application = this.state.application;
        var providers = this.state.providers;
        var identities = this.state.identities;

        if (application && providers && identities) {
          return (
            <ApplicationDetailsView
              application={this.state.application}
              providers={this.state.providers}
              identities={this.state.identities}
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
