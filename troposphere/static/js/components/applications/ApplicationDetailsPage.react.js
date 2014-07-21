/** @jsx React.DOM */

define(
  [
    'react',
    './common/SecondaryApplicationNavigation.react',
    'stores/ApplicationStore',
    'stores/ProviderStore',
    'stores/IdentityStore',
    'stores/MachineStore',
    './detail/ApplicationDetailsView.react',
    'context'
  ],
  function (React, SecondaryApplicationNavigation, ApplicationStore, ProviderStore, IdentityStore, MachineStore, ApplicationDetailsView, context) {

    function getState(applicationId) {
      var state = {
        application: ApplicationStore.get(applicationId),
        providers: null,
        identities: null
      };

      // Only fetch providers and identites if the user is logged in
      if(context.profile){
        state.providers = ProviderStore.getAll();
        state.identities = IdentityStore.getAll();
      }

      return state;
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
        var userLoggedIn = context.profile;
        var content;

        if (application) {
          // If the user isn't logged in, display the public view, otherwise
          // wait for providers and instances to be fetched
          if(!userLoggedIn){
            content = (
              <ApplicationDetailsView application={this.state.application}/>
            );
          }else if(providers && identities) {
            content = (
              <ApplicationDetailsView
                application={this.state.application}
                providers={this.state.providers}
                identities={this.state.identities}
              />
            );
          }
        }else{
          content = (
            <div className='loading'></div>
          );
        }

        return (
          <div>
            <SecondaryApplicationNavigation currentRoute="search"/>
            <div className="container">
              {content}
            </div>
          </div>
        );
      }

    });

  });
