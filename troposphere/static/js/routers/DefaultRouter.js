/*global define */

define(
  [
    'marionette',
    'backbone'
  ],
  function (Marionette, Backbone) {
    'use strict';

    var Router = Marionette.AppRouter.extend({
      appRoutes: {
        '*path': 'defaultRoute'
      }
    });

    var Controller = Marionette.Controller.extend({

      defaultRoute: function (param) {
        Backbone.history.navigate('projects', {trigger: true});
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
