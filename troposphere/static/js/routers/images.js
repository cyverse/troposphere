/*global define */

define(
  [
    'marionette',
    'components/Main.react',
    'models/session',
    'react',
    'components/applications/ApplicationsHome.react'
  ],
  function (Marionette, Root, Session, React, ApplicationsHome) {
    'use strict';

    var Router = Marionette.AppRouter.extend({
      appRoutes: {
        'images': 'showImages'
      }
    });

    var Controller = Marionette.Controller.extend({

      showImages: function (param) {

        var session = new Session({
          access_token: "fake-token",
          expires: "it's a mystery!"
        });

        var content = ApplicationsHome();

        var app = Root({session: session, content: content});
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
