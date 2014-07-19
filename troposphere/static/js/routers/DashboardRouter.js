/*global define */

define(
  [
    'marionette',
    'components/Root.react',
    'react',
    'components/dashboard/DashboardPage.react',
    'context',
    'backbone'
  ],
  function (Marionette, Root, React, DashboardPage, context, Backbone) {
    'use strict';

    var Router = Marionette.AppRouter.extend({
      appRoutes: {
        'dashboard': 'showDashboard'
      }
    });

    var Controller = Marionette.Controller.extend({

      render: function (content, route) {
        var app = Root({
          session: context.session,
          profile: context.profile,
          content: content,
          route: route || Backbone.history.getFragment()
        });
        React.renderComponent(app, document.getElementById('application'));
      },

      showDashboard: function (param) {
        this.render(DashboardPage(), ["dashboard"]);
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
