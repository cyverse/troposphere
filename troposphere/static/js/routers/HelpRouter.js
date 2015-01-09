/*global define */

define(
  [
    'marionette',
    'components/Root.react',
    'react',
    'components/help/HelpPage.react',
    'context',
    'backbone'
  ],
  function (Marionette, Root, React, HelpPage, context, Backbone) {
    'use strict';

    var Router = Marionette.AppRouter.extend({
      appRoutes: {
        'help': 'showHelp'
      }
    });

    var Controller = Marionette.Controller.extend({

      render: function (content, route) {
        var Component = React.createFactory(Root);
        var app = Component({
          profile: context.profile,
          content: content,
          route: route || Backbone.history.getFragment()
        });
        React.render(app, document.getElementById('application'));
      },

      showHelp: function (param) {
        var Component = React.createFactory(HelpPage);
        this.render(Component(), ["help"]);
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
