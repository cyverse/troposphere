/*global define */

define(
  [
    'marionette',
    'components/Main.react',
    'react',
    'context',
    'rsvp',
    'models/volume',
    'controllers/providers',
    'components/VolumeDetailWrapper.react'
  ],
  function (Marionette, Root, React, context, RSVP, Volume, ProviderController, VolumeDetail) {
    'use strict';

    var Router = Marionette.AppRouter.extend({
      appRoutes: {
        'provider/:provider_id/identity/:identity_id/volumes/:volume_id': 'showVolumeDetail'
      }
    });

    var Controller = Marionette.Controller.extend({

      render: function (content) {
        var app = Root({
          session: context.session,
          profile: context.profile,
          content: content,
          route: Backbone.history.getFragment()
        });
        React.renderComponent(app, document.getElementById('application'));
      },

      fetchVolume: function (providerId, identityId, volumeId) {
        var model = new Volume({
          identity: {
            provider: providerId,
            id: identityId
          },
          id: volumeId
        });

        model.fetch({
          success: function (volume) {
            this.state.volumes.add(volume);
            this.setState({volumes: this.state.volumes});
          }.bind(this),
          error: function () {
            NotificationController.danger("Unknown Volume", "The requested volume does not exist.");
          }
        });
      },

      fetchProviders: function () {
        return ProviderController.getProviders();
      },

      showVolumeDetail: function (providerId, identityId, volumeId) {
        RSVP.all({
          volume: this.fetchVolume(providerId, identityId, volumeId),
          providers: this.fetchProviders()
        }).then(function (results) {
          var content = VolumeDetail({
            volume: results.volume,
            providers: results.providers
          });
          this.render(content);
        });

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
