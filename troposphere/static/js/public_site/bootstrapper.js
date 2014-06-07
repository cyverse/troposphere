define(
  [
    'jquery',
    'rsvp',
    'backbone',

    // Cross-app models
    'context',
    'models/Session',

    // Routers
    './routers/ApplicationRouter',
    'routers/help'
  ],
  function ($, RSVP, Backbone, context, Session, ApplicationRouter, HelpRouter) {

    function startApplication() {

      // todo: Remove this smartly. It's here because the header component expects it
      context.session = new Session();

      // Catch-all for errors within promises
      RSVP.on('error', function (reason) {
        console.assert(false, reason);
      });

      $(document).ready(function () {

        // Start the project routers - one of them should be listening for the
        // default empty route ("")
        ApplicationRouter.start();
        HelpRouter.start();

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
        startApplication();
      }
    }

  });
