define(
  [
    'react',
    'marionette',
    'backbone',
    'context',
    'components/Root.react',
    'components/instances/ImageRequestPage.react',
    'components/instances/ReportInstancePage.react'
  ],
  function (React, Marionette, Backbone, context, Root, ImageRequestPage, ReportInstancePage) {
    'use strict';

    var Router = Marionette.AppRouter.extend({
      appRoutes: {
        'provider/:provider_id/identity/:identity_id/instances/:instance_id/request_image': 'showRequestImage',
        'provider/:provider_id/identity/:identity_id/instances/:instance_id/report': 'showReportInstance'
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

      showRequestImage: function(providerId, identityId, instanceId){
        this.render(ImageRequestPage({
          providerId: providerId,
          identityId: identityId,
          instanceId: instanceId
        }), ["instances"]);
      },

      showReportInstance: function(providerId, identityId, instanceId){
        this.render(ReportInstancePage({
          providerId: providerId,
          identityId: identityId,
          instanceId: instanceId
        }), ["instances"]);
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
