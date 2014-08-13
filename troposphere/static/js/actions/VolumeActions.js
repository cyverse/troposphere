define(
  [
    'react',
    'dispatchers/AppDispatcher',
    'constants/VolumeConstants',
    'constants/ProjectVolumeConstants',
    './modalHelpers/VolumeModalHelpers',
    'controllers/NotificationController',
    'models/Volume',
    'actions/ProjectVolumeActions',
    'components/notifications/VolumeAttachNotifications.react'
  ],
  function (React, AppDispatcher, VolumeConstants, ProjectVolumeConstants, VolumeModalHelpers, NotificationController, Volume, ProjectVolumeActions, VolumeAttachNotifications) {

    return {

      dispatch: function(actionType, payload, options){
        options = options || {};
        AppDispatcher.handleRouteAction({
          actionType: actionType,
          payload: payload,
          options: options
        });
      },

      // ------------------------
      // Standard CRUD Operations
      // ------------------------

      updateVolumeAttributes: function (volume, newAttributes) {
        var that = this;

        volume.set(newAttributes);
        that.dispatch(VolumeConstants.UPDATE_VOLUME, {volume: volume});

        volume.save({
          name: volume.get('name')
        },{
          patch: true
        }).done(function(){
          NotificationController.success(null, "Volume name updated");
          that.dispatch(VolumeConstants.UPDATE_VOLUME, {volume: volume});
        }).fail(function(){
          var message = "Error updating Volume " + volume.get('name') + ".";
          NotificationController.error(message);
        });
      },

      attach: function(volume, project){
        var that = this;

        VolumeModalHelpers.attach({
          volume: volume,
          project: project
        },{
          onConfirm: function (instance, mountLocation) {
            volume.attachTo(instance, mountLocation, {
              success: function () {
                NotificationController.success(null, VolumeAttachNotifications.success());
                that.dispatch(VolumeConstants.UPDATE_VOLUME, {volume: volume});
              },
              error: function () {
                var message = "Volume could not be attached. " + VolumeAttachNotifications.error();
                NotificationController.error(null, message);
              }
            });
          }
        });
      },

      detach: function (volume) {
        var that = this;

        VolumeModalHelpers.detach({
          volume: volume
        },{
          onConfirm: function () {
            volume.detach({
              success: function (model) {
                NotificationController.success(null, "Volume was detached.  It is now available to attach to another instance or destroy.");
                that.dispatch(VolumeConstants.UPDATE_VOLUME, {volume: volume});
              },
              error: function (message, response) {
                NotificationController.error(null, "Volume could not be detached");
              }
            });
          }
        });
      },

      _destroy: function(payload, options){
        var volume = payload.volume;
        var project = payload.project;
        var that = this;

        // todo: change volume state to show that it's being destroyed

        volume.destroy().done(function () {
          NotificationController.success(null, 'Volume destroyed');

          that.dispatch(VolumeConstants.REMOVE_VOLUME, {volume: volume});

          // todo: the proper thing to do is to poll until the volume is actually destroyed
          // and THEN remove it from the project. Need to add a callback to support that.
          // VolumeStore.pollUntilFinalState(volume);
          ProjectVolumeActions.removeVolumeFromProject(volume, project);

        }).fail(function (response) {
          NotificationController.error(null, 'Volume could not be deleted');
          //that.dispatch(VolumeConstants.ADD_VOLUME, {volume: volume});
        });
      },

      destroy: function(payload, options){
        var volume = payload.volume;
        var redirectUrl = payload.redirectUrl;
        var project = payload.project;
        var that = this;

        VolumeModalHelpers.destroy({
          volume: volume
        },{
          onConfirm: function () {
            that._destroy(payload, options);
            if(redirectUrl) Backbone.history.navigate(redirectUrl, {trigger: true});
          }
        });
      },

      destroy_noModal: function(payload, options){
        this._destroy(payload, options);
      },

      createAndAddToProject: function(payload){
        var project = payload.project;
        var that = this;

        VolumeModalHelpers.createAndAddToProject(null, {
          onConfirm: function (volumeName, volumeSize, identity) {

            var volume = new Volume({
              identity: {
                id: identity.id,
                provider: identity.get('provider_id')
              },
              name: volumeName,
              description: "",
              size: volumeSize
            });

            var params = {
              model_name: "volume",
              tags: "CF++"
            };

            that.dispatch(VolumeConstants.ADD_VOLUME, {volume: volume});
            that.dispatch(ProjectVolumeConstants.ADD_PENDING_VOLUME_TO_PROJECT, {
              volume: volume,
              project: project
            });

            volume.save(params).done(function () {
              NotificationController.success(null, 'Volume created');
              that.dispatch(VolumeConstants.UPDATE_VOLUME, {volume: volume});
              that.dispatch(ProjectVolumeConstants.REMOVE_PENDING_VOLUME_FROM_PROJECT, {
                volume: volume,
                project: project
              });
              ProjectVolumeActions.addVolumeToProject(volume, project);
              //pollUntilBuildIsFinished(volume);
            }).fail(function () {
              NotificationController.error(null, 'Volume could not be created');

              that.dispatch(VolumeConstants.REMOVE_VOLUME, {volume: volume});
              that.dispatch(ProjectVolumeConstants.REMOVE_PENDING_VOLUME_FROM_PROJECT, {
                volume: volume,
                project: project
              });
            });
          }
        })

      }

    };

  });
