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
  function (Marionette, Root, React, context, RSVP, Volume, ProviderController, VolumeDetailsPage, NotificationController) {
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

      fetchVolume: function (providerId, identityId, volumeId) {
        var promise = new RSVP.Promise(function (resolve, reject) {
          var volume = new Volume({
            identity: {
              provider: providerId,
              id: identityId
            },
            id: volumeId
          });

          volume.fetch({
            success: function (volumeAttributes) {
              resolve(volume);
            },
            error: function () {
              NotificationController.danger("Unknown Volume", "The requested volume does not exist.");
            }
          });
        });
        return promise;
      },

      fetchProviders: function () {
        return ProviderController.getProviders();
      },

      showVolumeDetail: function (providerId, identityId, volumeId) {
//        RSVP.hash({
//          volume: this.fetchVolume(providerId, identityId, volumeId),
//          providers: this.fetchProviders()
//        })
//        .then(function (results) {
//          var content = VolumeDetailsPage({
//            volume: results.volume,
//            providers: results.providers
//          });
//
//          this.render(content, "projects");
//        }.bind(this));

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
