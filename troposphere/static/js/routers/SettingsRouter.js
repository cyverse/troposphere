/*global define */

define(
  [
    'marionette',
    'components/Root.react',
    'react',
    'components/settings/SettingsPage.react',
    'context',
    'backbone'
  ],
  function (Marionette, Root, React, SettingsPage, context, Backbone) {
    'use strict';

    var Router = Marionette.AppRouter.extend({
      appRoutes: {
        'settings': 'showSettings'
      }
    });

    var Controller = Marionette.Controller.extend({

      render: function(content, route){
        var app = Root({
          session: context.session,
          profile: context.profile,
          content: content,
          route: route || Backbone.history.getFragment()
        });
        React.renderComponent(app, document.getElementById('application'));
      },

      showSettings: function (param) {
        this.render(SettingsPage(), ["settings"]);
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
