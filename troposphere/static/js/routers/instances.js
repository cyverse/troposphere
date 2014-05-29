define(
  [
    'marionette',
    'components/Root.react',
    'react',
    'context',
    'components/instances/InstanceDetailsPage.react',
    'components/instances/InstanceListPage.react',
    'components/instances/ImageRequestPage.react'
  ],
  function (Marionette, Root, React, context, InstanceDetails, InstanceListPage, ImageRequestPage) {
    'use strict';

    var Router = Marionette.AppRouter.extend({
      appRoutes: {
        'instances': 'showInstances',
        'provider/:provider_id/identity/:identity_id/instances/:instance_id': 'showInstanceDetail',
        'provider/:provider_id/identity/:identity_id/instances/:instance_id/request_image': 'showRequestImage'
        // 'provider/:provider_id/identity/:identity_id/instances/:instance_id/report': 'showReportInstance'
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

      showInstances: function () {
        this.render(InstanceListPage(), "instances");
      },

      showInstanceDetail: function (providerId, identityId, instanceId) {
        this.render(InstanceDetails({
          providerId: providerId,
          identityId: identityId,
          instanceId: instanceId
        }), "projects");
      },

      showRequestImage: function(providerId, identityId, instanceId){
        this.render(ImageRequestPage({
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
