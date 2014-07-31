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
        var app = Root({
          profile: context.profile,
          content: content,
          route: route || Backbone.history.getFragment()
        });
        React.renderComponent(app, document.getElementById('application'));
      },

      showHelp: function (param) {
        this.render(HelpPage(), ["help"]);
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
