/*global define */

define(
  [
    'marionette',
    'components/Root.react',
    'models/session',
    'react'
  ],
  function (Marionette, Root, Session, React) {
    'use strict';

    var Router = Marionette.AppRouter.extend({
      appRoutes: {
        '': 'showProjects'
      }
    });

    var Controller = Marionette.Controller.extend({

      showProjects: function (param) {

        var session = new Session({
          access_token: "fake-token",
          expires: "it's a mystery!"
        });

        var app = Root({session: session});
        React.renderComponent(app, document.getElementById('application'));
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
