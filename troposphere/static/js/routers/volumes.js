/*global define */

define(
  [
    'marionette',
    'components/Root.react',
    'react',
    'context',
    'rsvp',
    'models/volume',
    'controllers/providers',
    'components/volumes/VolumeDetailsPage.react',
    'controllers/notifications'
  ],
  function (Marionette, Root, React, context, VolumeDetailsPage) {
    'use strict';

    var Router = Marionette.AppRouter.extend({
      appRoutes: {
        'provider/:provider_id/identity/:identity_id/volumes/:volume_id': 'showVolumeDetail'
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

      showVolumeDetail: function (providerId, identityId, volumeId) {
        this.render(VolumeDetailsPage({
          providerId: providerId,
          identityId: identityId,
          volumeId: volumeId
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
