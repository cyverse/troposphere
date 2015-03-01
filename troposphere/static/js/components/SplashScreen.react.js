/** @jsx React.DOM */

define(
  [
    'jquery',
    'react',
    'context',
    'stores',

    // Routers
    'routers/DashboardRouter',
    'routers/ProjectRouter',
    'routers/ApplicationRouter',
    'routers/SettingsRouter',
    'routers/HelpRouter',
    'routers/ProviderRouter',
    'routers/DefaultRouter',

    '../Router'
  ],
  function ($, React, context, stores, DashboardRouter, ProjectRouter, ApplicationRouter, SettingsRouter, HelpRouter, ProviderRouter, DefaultRouter, Router) {

    function getState() {
      return {
        profile: stores.ProfileStore.get()
        //identities: stores.IdentityStore.getAll(),
        //projects: stores.ProjectStore.getAll(),
        //nullProject: stores.NullProjectStore.get(),
        //maintenanceMessages: stores.MaintenanceMessageStore.getAll(),
        //providers: stores.ProviderStore.getAll(),
        // fetching applications here just to make the application feel more responsive
        // by the time the user navigates to the applications page
        //applications: stores.ApplicationStore.getAll()
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
        var profile = stores.ProfileStore.get();

        //var nullProject = stores.NullProjectStore.get();
        //// we're fetching the identities during app load because it simplifies a lot of code
        //// if we can assume the identities are already here.  In order to get all user instances
        //// and volumes we have to loop through all identities to get the whole collection.
        //// If we don't fetch all identities before the application loads, then each view that
        //// needs the instances or volumes ends up having to listen to change events on the IdentityStore
        //// in order to see if it's possible to fetch the identities yet (because the long urls require
        //// knowing provider and identity information - provider/1/identity/2/instance)
        //var identities = stores.IdentityStore.getAll();
        //var maintenanceMessages = stores.MaintenanceMessageStore.getAll();
        //var providers = stores.ProviderStore.getAll();
        //var projects = stores.ProjectStore.getAll();

        var isEmulatedUser;

        if(profile){//}) && identities && nullProject && maintenanceMessages && providers && projects){
          // set user context
          context.profile = profile;
          //context.nullProject = nullProject;

          // if the emulator token exists, the user is being emulated by staff
          // in that case, this doesn't count as a real session, so don't report
          // it to Intercom.
          isEmulatedUser = !!window.emulator_token;

          if(!isEmulatedUser) {
            window.Intercom('boot', {
              app_id: window.intercom_app_id,
              name: profile.get("username"),
              username: profile.get("username"),
              email: profile.get("email"),
              company: {
                id: window.intercom_company_id,
                name: window.intercom_company_name
              }
              // TODO: The current logged in user's sign-up date as a Unix timestamp.
              //created_at: 1234567890
            });
          }

          this.startApplication();
        }
      },

      componentDidMount: function () {
        stores.ProfileStore.addChangeListener(this.updateState);
        stores.IdentityStore.addChangeListener(this.updateState);
        stores.NullProjectStore.addChangeListener(this.updateState);
        stores.ApplicationStore.addChangeListener(this.updateState);
        stores.ProjectStore.addChangeListener(this.updateState);
        stores.MaintenanceMessageStore.addChangeListener(this.updateState);
        stores.ProviderStore.addChangeListener(this.updateState);
      },

      componentWillUnmount: function () {
        stores.ProfileStore.removeChangeListener(this.updateState);
        stores.IdentityStore.removeChangeListener(this.updateState);
        stores.NullProjectStore.removeChangeListener(this.updateState);
        stores.ApplicationStore.removeChangeListener(this.updateState);
        stores.ProjectStore.removeChangeListener(this.updateState);
        stores.MaintenanceMessageStore.removeChangeListener(this.updateState);
        stores.ProviderStore.removeChangeListener(this.updateState);
      },

      startApplication: function(){

        $('body').removeClass('splash-screen');

        // Start the application router
        Router.getInstance().run(function (Handler, state) {
          // you might want to push the state of the router to a store for whatever reason
          // RouterActions.routeChange({routerState: state});

          // Update intercom so users get any messages sent to them
          window.Intercom('update');

          // whenever the url changes, this callback is called again
          React.render(<Handler/>, document.getElementById("application"));
        });
      },

      render: function () {
        return null;
      }

    });

  });
