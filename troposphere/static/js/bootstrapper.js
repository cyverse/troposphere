define(
  [
    'jquery',
    'backbone',

    // Cross-app models
    './context',
    'models/Session',
    'controllers/ProfileController',
    'controllers/NotificationController',

    // Routers
    'routers/DashboardRouter',
    'routers/ProjectRouter',
    'routers/ApplicationRouter',
    'routers/SettingsRouter',
    'routers/HelpRouter',
    'routers/ProviderRouter',
    'routers/DefaultRouter'
  ],
  function ($, Backbone, context, Session, ProfileController, NotificationController, DashboardRouter, ProjectRouter, ApplicationRouter, SettingsRouter, HelpRouter, ProviderRouter, DefaultRouter) {

    function startApplication() {

      $(document).ready(function () {

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
      });
    }

    return {
      run: function () {

        // todo: store user session in some lightweight object
        // accessible across the app (but not on window)
        var session = new Session();

        // todo: remove in production - development mode only
        if (window.location.hostname == 'localhost') {
            window.access_token = "api-token";

            $.ajaxSetup({
              headers: {
                "Authorization": "Token " + window.access_token,
                "Content-Type": "application/json"
              }
            });

            session.set({
              access_token: window.access_token
            });

        // For Chris to use w/ Apache config
        } else { // if (window.access_token)
          $.ajaxSetup({
            headers: {
              "Authorization": "Token " + window.access_token,
              "Content-Type": "application/json"
            }
          });
          session.set({
            access_token: window.access_token
          });
        }

        // Fetch the users profile
        ProfileController.getProfile().then(function (profile) {

          // set user context
          context.session = session;
          context.profile = profile;

          $('body').removeClass('splash-screen');

          startApplication();
        }).catch(function(e) {
            NotificationController.error(
              null,
              "There was an error logging you in. If this persists, please email <a href='mailto:support@iplantcollaborative.org'>support@iplantcollaborative.org</a>.",
              {
                "positionClass": "toast-top-full-width"
              }
            )
        }).done();
      }
    }

  });
