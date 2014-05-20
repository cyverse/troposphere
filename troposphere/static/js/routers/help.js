/*global define */

define(
  [
    'marionette',
    'components/Main.react',
    'models/session',
    'react',
    'components/Help.react',
    'context'
  ],
  function (Marionette, Root, Session, React, Help, context) {
    'use strict';

    var Router = Marionette.AppRouter.extend({
      appRoutes: {
        'help': 'showHelp'
      }
    });

    var Controller = Marionette.Controller.extend({

      render: function (content) {
        var app = Root({
          session: context.session,
          profile: context.profile,
          content: content,
          route: Backbone.history.getFragment()
        });
        React.renderComponent(app, document.getElementById('application'));
      },

      showHelp: function (param) {
        var content = Help();
        this.render(content);
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
