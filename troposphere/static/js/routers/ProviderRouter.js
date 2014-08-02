/*global define */

define(
  [
    'marionette',
    'components/Root.react',
    'react',
    'components/providers/ProviderListPage.react',
    'context',
    'backbone'
  ],
  function (Marionette, Root, React, ProviderListPage, context, Backbone) {
    'use strict';

    var Router = Marionette.AppRouter.extend({
      appRoutes: {
        'providers': 'showProviders'
      }
    });

    var Controller = Marionette.Controller.extend({

      render: function(content, route){
        var app = Root({
          profile: context.profile,
          content: content,
          route: route || Backbone.history.getFragment()
        });
        React.renderComponent(app, document.getElementById('application'));
      },

      showProviders: function (param) {
        this.render(ProviderListPage(), ["providers"]);
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
