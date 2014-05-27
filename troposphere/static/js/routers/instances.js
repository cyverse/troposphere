define(
  [
    'marionette',
    'components/Root.react',
    'react',
    'context',
    'components/instances/InstanceDetailsPage.react'
  ],
  function (Marionette, Root, React, context, InstanceDetails) {
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

      showInstanceDetail: function (providerId, identityId, instanceId) {
        this.render(InstanceDetails({
          providerId: providerId,
          identityId: identityId,
          instanceId: instanceId
        }), "projects");
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
