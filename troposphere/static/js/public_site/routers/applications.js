/*global define */

define(
  [
    'marionette',
    'components/Root.react',
    'models/session',
    'react',
    'components/applications/list/ApplicationsHome.react',
    'components/applications/favorites/Favorites.react',
    'components/applications/detail/ApplicationDetail.react',
    'components/applications/search/SearchResults.react',
    'models/application',
    'rsvp',
    'context',
    'collections/applications',
    'actions/applications'
  ],
  function ( Marionette, Root, Session, React, ApplicationList, ApplicationFavorites, ApplicationDetail,
    Results, Application, RSVP, context, Applications, ApplicationActions) {
    'use strict';

    var Router = Marionette.AppRouter.extend({
      appRoutes: {
        '': 'showImages',
        'images': 'showImages',
        'images/:id': 'showAppDetail',
        'images/search/:query': 'appSearch'
      }
    });

    var Controller = Marionette.Controller.extend({

      render: function (content, route) {
        var app = Root({
          session: context.session,
          profile: context.profile,
          content: content,
          route: route || Backbone.history.getFragment()
        });
        React.renderComponent(app, document.getElementById('application'));
      },

      //
      // Fetching functions
      //
      fetchApplication: function (appId) {
        ApplicationActions.fetch(appId);
      },

      fetchApplications: function () {
        ApplicationActions.fetchAll();
      },

      //
      // Route handlers
      //
      showImages: function () {
        this.render(ApplicationList(), "images");
        this.fetchApplications();
      },

      showAppFavorites: function () {
        var content = ApplicationFavorites();
        this.render(content);
      },

      showAppAuthored: function () {
        var content = ApplicationFavorites();
        this.render(content);
      },

      showAppDetail: function (appId) {
        var content = ApplicationDetail({
          applicationId: appId
        });
        this.render(content, "images");
        this.fetchApplication(appId);
      },

      appSearch: function(query) {
        var content = Results({query: query});
        this.render(content, "appSearch");
      }

    });

    return {
      start: function () {
        var controller = new Controller();
        var router = new Router({
          controller: controller
        });
      }
    }

  });
