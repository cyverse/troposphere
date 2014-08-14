/** @jsx React.DOM */

define(
  [
    'jquery',
    'react',
    'context',
    'stores/ProfileStore',
    'stores/IdentityStore',
    'stores/NullProjectStore',

    // Routers
    'routers/DashboardRouter',
    'routers/ProjectRouter',
    'routers/ApplicationRouter',
    'routers/SettingsRouter',
    'routers/HelpRouter',
    'routers/ProviderRouter',
    'routers/DefaultRouter'
  ],
  function ($, React, context, ProfileStore, IdentityStore, NullProjectStore, DashboardRouter, ProjectRouter, ApplicationRouter, SettingsRouter, HelpRouter, ProviderRouter, DefaultRouter) {

    function getState() {
      return {
        profile: ProfileStore.get(),
        identities: IdentityStore.getAll(),
        nullProject: NullProjectStore.get()
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
        var profile = ProfileStore.get();
        var nullProject = NullProjectStore.get();
        // we're fetching the identities during app load because it simplifies a lot of code
        // if we can assume the identities are already here.  In order to get all user instances
        // and volumes we have to loop through all identities to get the whole collection.
        // If we don't fetch all identities before the application loads, then each view that
        // needs the instances or volumes ends up having to listen to change events on the IdentityStore
        // in order to see if it's possible to fetch the identities yet (because the long urls require
        // knowing provider and identity information - provider/1/identity/2/instance)
        var identities = IdentityStore.getAll();
        if(profile && identities && nullProject){
          // set user context
          context.profile = profile;
          context.nullProject = nullProject;

          this.startApplication();
        }
      },

      componentDidMount: function () {
        ProfileStore.addChangeListener(this.updateState);
        IdentityStore.addChangeListener(this.updateState);
        NullProjectStore.addChangeListener(this.updateState);
      },

      componentWillUnmount: function () {
        ProfileStore.removeChangeListener(this.updateState);
        IdentityStore.removeChangeListener(this.updateState);
        NullProjectStore.removeChangeListener(this.updateState);
      },

      startApplication: function(){

        $('body').removeClass('splash-screen');

        // Start the project routers
        //
        // Note: The default router needs to start first, so it's wildcard route will be the last route
        // that Backbone attempts to match against
        //
        DefaultRouter.start();
        DashboardRouter.start();
        ProjectRouter.start();
        ApplicationRouter.start();
        SettingsRouter.start();
        HelpRouter.start();
        ProviderRouter.start();

        // For push state support:
        // Route all internal links to the Backbone router(s). External links
        // will still work as expected.  This only affects routes beginning
        // with "/" (ie.e <a href="/projects"></a>)
        //
        // Note about Backbone root:
        // When root is set, Backbone prepends it to all urls.  If root is /app,
        // then Backbone.history.navigate("/fox") will navigate to /app/fox. While
        // this is great when navigating internally through Backbone.history.navigate
        // if we are catching a link with an href of /app/fox, the new link after
        // calling navigate will be /app/app/fox, so we need to remove the base from
        // links that have it before letting Backbone add it back.
        // http://artsy.github.io/blog/2012/06/25/replacing-hashbang-routes-with-pushstate/
        //

        var urlRoot = '/application/';
        Backbone.history.start({
          pushState: true,
          root: urlRoot
        });

        $(document).on("click", "a[href^='" + urlRoot + "']", function (event) {
          if (!event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey) {
            event.preventDefault();
            var regExp = new RegExp("^" + urlRoot); // Ex: /^\/application\//
            var url = $(event.currentTarget).attr("href").replace(regExp, "");
            Backbone.history.navigate(url, { trigger: true });
          }
        });
      },

      render: function () {
        // return (
        //   <div className="splash-image">
        //     <img src="/assets/images/login_mainimage.png"/>
        //     <div className="loading"></div>
        //     <h4>Loading Atmosphere...</h4>
        //   </div>
        // );

        return null;
      }

    });

  });
