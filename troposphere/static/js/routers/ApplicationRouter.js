/*global define */

define(
  [
    'marionette',
    'components/Root.react',
    'react',
    'components/applications/list/ApplicationListView.react',
    'components/applications/favorites/Favorites.react',
    'components/applications/detail/ApplicationDetail.react',
    'components/applications/search/SearchResults.react',
    'rsvp',
    'context',
    'actions/ApplicationActions',
    'backbone'
  ],
  function (Marionette, Root, React, ApplicationListView, ApplicationFavorites, ApplicationDetail, SearchResults, RSVP, context, ApplicationActions, Backbone) {
    'use strict';

    var Router = Marionette.AppRouter.extend({
      appRoutes: {
        'images': 'showImages',
        'images/:id': 'showAppDetail',
        'images/favorites': 'showAppFavorites',
        'images/search/:query': 'appSearch'
        // todo: implement authored and search routes
        //'images/authored': 'showAppAuthored',
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
      // Route handlers
      //
      showImages: function () {
        this.render(ApplicationListView(), "images");
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
      },

      appSearch: function (query) {
        var content = SearchResults({query: query});
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
