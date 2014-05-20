/*global define */

define(
  [
    'marionette',
    'components/Main.react',
    'models/session',
    'react',
    'components/applications/ApplicationsHome.react',
    'components/applications/Favorites.react',
    'components/applications/ApplicationDetail.react'
  ],
  function (Marionette, Root, Session, React, ApplicationList, ApplicationFavorites, ApplicationDetail) {
    'use strict';

    var session = new Session({
      access_token: "fake-token",
      expires: "it's a mystery!"
    });

    var Router = Marionette.AppRouter.extend({
      appRoutes: {
        'images': 'showImages',
        'images/favorites': 'showAppFavorites',
        //'images/authored': 'showAppAuthored',
        'images/:id': 'showAppDetail'
        //'images/search/:query': 'appSearch'
      }
    });

    var Controller = Marionette.Controller.extend({

      render: function(content){
        var app = Root({
          session: session,
          content: content,
          route: Backbone.history.getFragment()
        });
        React.renderComponent(app, document.getElementById('application'));
      },

      showImages: function () {
        var content = ApplicationList();
        this.render(content);
      },

      showAppFavorites: function () {
        var content = ApplicationFavorites();
        this.render(content);
      },

      showAppAuthored: function () {
        var content = ApplicationFavorites();
        this.render(content);
      },

      showAppDetail: function(appId){
//        var application = this.state.applications.get(appId);
//
//        ApplicationDetail({
//          application: application,
//          onRequestApplication: this.fetchApplication.bind(this, appId),
//          onRequestIdentities: this.fetchIdentities,
//          profile: this.state.profile,
//          identities: this.state.identities,
//          providers: this.state.providers
//        })
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
