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
        profile: stores.ProfileStore.get(),
        identities: stores.IdentityStore.getAll(),
        projects: stores.ProjectStore.getAll(),
        nullProject: stores.NullProjectStore.get(),
        maintenanceMessages: stores.MaintenanceMessageStore.getAll(),
        providers: stores.ProviderStore.getAll(),
        // fetching applications here just to make the application feel more responsive
        // by the time the user navigates to the applications page
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
        var profile = stores.ProfileStore.get();
        var nullProject = stores.NullProjectStore.get();
        // we're fetching the identities during app load because it simplifies a lot of code
        // if we can assume the identities are already here.  In order to get all user instances
        // and volumes we have to loop through all identities to get the whole collection.
        // If we don't fetch all identities before the application loads, then each view that
        // needs the instances or volumes ends up having to listen to change events on the IdentityStore
        // in order to see if it's possible to fetch the identities yet (because the long urls require
        // knowing provider and identity information - provider/1/identity/2/instance)
        var identities = stores.IdentityStore.getAll();
        var maintenanceMessages = stores.MaintenanceMessageStore.getAll();
        var providers = stores.ProviderStore.getAll();
        var projects = stores.ProjectStore.getAll();

        var isEmulatedUser;

        if(profile && identities && nullProject && maintenanceMessages && providers && projects){
          // set user context
          context.profile = profile;
          context.nullProject = nullProject;

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

        var matchesExpression = function(url, expression){
          var re = new RegExp(expression);
          return !!re.exec(url);
        };

        var getTitle = function(url){

          if(matchesExpression(url, "^(dashboard)$")){ // dashboard
            return "Dashboard";

          }else if(matchesExpression(url, "^(projects)$")){ // projects
            return "Projects";

          }else if(matchesExpression(url, "^(projects\\/[\\w\\d\\-]+)$")){ // projects/3106
             return "Project Details";

          }else if(matchesExpression(url, "^(projects\\/[\\w\\d\\-]+\\/resources)$")){ // projects/3106/resources
             return "Project Resources";

          }else if(matchesExpression(url, "^(projects\\/[\\w\\d\\-]+\\/instances\\/[\\w\\d\\-]+)$")){ // projects/3106/instances/5bac377d-bd04-40ec-a101-5b12b5477ec6
             return "Instance Details";

          }else if(matchesExpression(url, "^(projects\\/[\\w\\d\\-]+\\/instances\\/[\\w\\d\\-]+\\/report)$")){ // projects/3106/instances/5bac377d-bd04-40ec-a101-5b12b5477ec6/report
             return "Report Instance";

          }else if(matchesExpression(url, "^(projects\\/[\\w\\d\\-]+\\/instances\\/[\\w\\d\\-]+\\/request_image)$")){ // projects/3106/instances/5bac377d-bd04-40ec-a101-5b12b5477ec6/request_image
             return "Request Image";

          }else if(matchesExpression(url, "^(projects\\/[\\w\\d\\-]+\\/volumes\\/[\\w\\d\\-]+)$")){ // projects/3106/volumes/4b8ebc12-ba61-4f22-8f7c-c670c857d5a2
             return "Volume Details";

          }else if(matchesExpression(url, "^(images)$")){ // images
             return "Images";

          }else if(matchesExpression(url, "^(images\\/[\\w\\d\\-]+)$")){ // images/fb065674-3ec2-599d-81ea-f69b542b6523
             return "Image Details";

          }else if(matchesExpression(url, "^(images\\/search\\/[\\w\\d\\-\\%]+)")){ // images/search/maker
             return "Image Search";

          }else if(matchesExpression(url, "^(images\\/favorites)$")){ // images/favorites
             return "Favorite Images";

          }else if(matchesExpression(url, "^(images\\/authored)$")){ // images/authored
             return "My Images";

          }else if(matchesExpression(url, "^(images\\/tags)$")){ // images/tags
             return "Image Tags";

          }else if(matchesExpression(url, "^(providers)$")){ // providers
             return "Providers";

          }else if(matchesExpression(url, "^(help)$")){ // help
             return "Help";

          }else if(matchesExpression(url, "^(settings)$")){ // settings
             return "Settings";

          }else{
             return "";

          }

        };

        //$(document).on("click", "a[href^='" + urlRoot + "']", function (event) {
        //  if (!event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey) {
        //    event.preventDefault();
        //    var regExp = new RegExp("^" + urlRoot); // Ex: /^\/application\//
        //    var url = $(event.currentTarget).attr("href").replace(regExp, "");
        //    var title = getTitle(url);
        //    document.title = title ? title + " - Atmosphere" : "Atmosphere";
        //    Backbone.history.navigate(url, { trigger: true });
        //
        //    // Update intercom so users get any messages sent to them
        //    window.Intercom('update');
        //  }
        //});

        //
        // Start the application router
        //

        //Render the main app component
        Router.getInstance().run(function (Handler, state) {
          // you might want to push the state of the router to a store for whatever reason
          //RouterActions.routeChange({routerState: state});

          // whenever the url changes, this callback is called again
          React.render(<Handler/>, document.getElementById("application"));
        });
      },

      render: function () {
        return null;
      }

    });

  });
