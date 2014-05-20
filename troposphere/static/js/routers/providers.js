/*global define */

define(
  [
    'marionette',
    'components/Main.react',
    'models/session',
    'react',
    'components/Providers.react',
    'controllers/providers'
  ],
  function (Marionette, Root, Session, React, Providers, ProviderController) {
    'use strict';

    var session = new Session({
      access_token: "fake-token",
      expires: "it's a mystery!"
    });

    var Router = Marionette.AppRouter.extend({
      appRoutes: {
        'providers': 'showProviders'
      }
    });

    var Controller = Marionette.Controller.extend({

      render: function(content){
        var app = Root({
          session: session,
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
