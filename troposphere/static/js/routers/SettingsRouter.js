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
        var Component = React.createFactory(Root);
        var app = Component({
          profile: context.profile,
          content: content,
          route: route || Backbone.history.getFragment()
        });
        React.render(app, document.getElementById('application'));
      },

      showSettings: function (param) {
        var Component = React.createFactory(SettingsPage);
        this.render(Component(), ["settings"]);
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
