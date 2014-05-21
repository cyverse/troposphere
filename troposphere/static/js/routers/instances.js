/*global define */

define(
  [
    'marionette',
    'components/Main.react',
    'react',
    'context',
    'rsvp',
    'models/instance',
    'controllers/providers',
    'components/instances/InstanceDetail.react'
  ],
  function (Marionette, Root, React, context, RSVP, Instance, ProviderController, InstanceDetail) {
    'use strict';

    var Router = Marionette.AppRouter.extend({
      appRoutes: {
        'provider/:provider_id/identity/:identity_id/instances/:instance_id': 'showInstanceDetail'
        //'provider/:provider_id/identity/:identity_id/instances/:instance_id/report': 'showReportInstance'
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

      fetchInstance: function (providerId, identityId, instanceId) {
        var promise = new RSVP.Promise(function (resolve, reject) {
          var instance = new Instance({
            identity: {
              provider: providerId,
              id: identityId
            },
            id: instanceId
          });

          instance.fetch({
            success: function (instanceAttributes) {
              resolve(instance);
            },
            error: function () {
              NotificationController.danger("Unknown Instance", "The requested instance does not exist.");
            }
          });
        });
        return promise;
      },

      fetchProviders: function () {
        return ProviderController.getProviders();
      },

      showInstanceDetail: function (providerId, identityId, instanceId) {
        RSVP.hash({
          instance: this.fetchInstance(providerId, identityId, instanceId),
          providers: this.fetchProviders()
        })
        .then(function (results) {
          var content = InstanceDetail({
            instance: results.instance,
            providers: results.providers
          });
          this.render(content, "projects");
        }.bind(this));

        this.render(InstanceDetail(), "projects");
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
