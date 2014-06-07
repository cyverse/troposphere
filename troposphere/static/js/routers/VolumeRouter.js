/*global define */

define(
  [
    'marionette',
    'components/Root.react',
    'react',
    'context',
    'components/volumes/VolumeDetailsPage.react',
    'components/volumes/VolumeListPage.react',
    'backbone'
  ],
  function (Marionette, Root, React, context, VolumeDetailsPage, VolumeListPage, Backbone) {
    'use strict';

    var Router = Marionette.AppRouter.extend({
      appRoutes: {
        'volumes': 'showVolumes',
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

      showVolumes: function () {
        this.render(VolumeListPage(), "volumes");
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
