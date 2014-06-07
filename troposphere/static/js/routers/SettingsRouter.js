/*global define */

define(
  [
    'marionette',
    'components/Root.react',
    'react',
    'components/settings/Settings.react',
    'controllers/profile',
    'context',
    'backbone'
  ],
  function (Marionette, Root, React, Settings, Profile, context, Backbone) {
    'use strict';

    var Router = Marionette.AppRouter.extend({
      appRoutes: {
        'settings': 'showSettings'
      }
    });

    var Controller = Marionette.Controller.extend({

      render: function(content){
        var app = Root({
          session: context.session,
          profile: context.profile,
          content: content,
          route: Backbone.history.getFragment()
        });
        React.renderComponent(app, document.getElementById('application'));
      },

      fetchProfile: function () {
        return Profile.getProfile();
      },

      showSettings: function (param) {
        this.fetchProfile().then(function (profile) {
          var content = Settings({profile: profile});
          this.render(content);
        }.bind(this));
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
