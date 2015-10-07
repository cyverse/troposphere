define(function (require) {

  var $ = require('jquery'),
    React = require('react/addons'),
    context = require('context'),
    stores = require('stores'),
    Router = require('../Router'),
    routes = require('../AppRoutes.react');

  return React.createClass({
    displayName: "SplashScreen",

    //
    // Mounting & State
    // ----------------
    //

    getInitialState: function () {
      return {
        profile: stores.ProfileStore.get(),
        instances: stores.InstanceStore.getAll(),
        volumes: stores.VolumeStore.getAll()
      };
    },

    updateState: function () {
      var profile = stores.ProfileStore.get(),
        instances = stores.InstanceStore.getAll(),
        volumes = stores.VolumeStore.getAll(),
        isEmulatedUser;

      if (profile && instances && volumes) {

        // set user context
        context.profile = profile;
        //context.nullProject = nullProject;

        // if the emulator token exists, the user is being emulated by staff
        // in that case, this doesn't count as a real session, so don't report
        // it to Intercom.
        isEmulatedUser = !!window.emulator_token;

        if (!isEmulatedUser) {
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
      stores.InstanceStore.addChangeListener(this.updateState);
      stores.VolumeStore.addChangeListener(this.updateState);
    },

    componentWillUnmount: function () {
      stores.ProfileStore.removeChangeListener(this.updateState);
      stores.InstanceStore.removeChangeListener(this.updateState);
      stores.VolumeStore.removeChangeListener(this.updateState);
    },

    startApplication: function () {

      $('body').removeClass('splash-screen');

      // Start the application router
      Router.getInstance(routes).run(function (Handler, state) {
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
