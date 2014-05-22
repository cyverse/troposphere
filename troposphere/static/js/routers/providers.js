/*global define */

define(
  [
    'marionette',
    'components/Main.react',
    'models/session',
    'react',
    'components/providers/Providers.react',
    'controllers/providers',
    'context'
  ],
  function (Marionette, Root, Session, React, Providers, ProviderController, context) {
    'use strict';

    var Router = Marionette.AppRouter.extend({
      appRoutes: {
        'providers': 'showProviders'
      }
    });

    var Controller = Marionette.Controller.extend({

      render: function(content){
        var app = Root({
          session: context.session,
          profile: context.profile,
          content: content,
          route: Backbone.history.getFragment()
        });
        React.renderComponent(app, document.getElementById('application'));
      },

      fetchProviders: function(){
        return ProviderController.getProviders();
      },

      showProviders: function (param) {
        this.fetchProviders().then(function (providers) {
          var content = Providers({providers: providers});
          this.render(content);
        }.bind(this));

        // todo: move fetching of providers into the component
        //var content = Providers();
        this.render(null);
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
