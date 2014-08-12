define(
  [
    'react',
    'dispatchers/AppDispatcher',
    'constants/VolumeConstants',
    'constants/ProjectVolumeConstants',
    'components/modals/CancelConfirmModal.react',
    'components/modals/VolumeDetachBody.react',
    'components/modals/VolumeDestroyBody.react',
    'components/modals/VolumeAttachModal.react',
    'components/modals/VolumeCreateModal.react',
    './modalHelpers/VolumeModalHelpers',
    'controllers/NotificationController',
    'models/Volume'
  ],
  function (React, AppDispatcher, VolumeConstants, ProjectVolumeConstants, CancelConfirmModal, VolumeDetachBody, VolumeDestroyBody, VolumeAttachModal, VolumeCreateModal, VolumeModalHelpers, NotificationController, Volume) {

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

      detach: function (volume) {

//        volume.detach({
//          success: function (model) {
//            NotificationController.success("Success", "Volume was detached.  It is now available to attach to another instance or destroy.");
//            VolumeStore.emitChange();
//          },
//          error: function (message, response) {
//            NotificationController.error("Error", "Volume could not be detached");
//            VolumeStore.emitChange();
//          }
//        });

        var onConfirm = function () {
          AppDispatcher.handleRouteAction({
            actionType: VolumeConstants.VOLUME_DETACH,
            volume: volume
          });
        };

        var onCancel = function(){
          // Important! We need to un-mount the component so it un-registers from Stores and
          // also so that we can relaunch it again later.
          React.unmountComponentAtNode(document.getElementById('modal'));
        };

        var headerMessage = "Detach volume " + volume.get('name') + "?";

        var modal = CancelConfirmModal({
          header: headerMessage,
          confirmButtonMessage: "Yes, detach this volume",
          body: VolumeDetachBody.build(),
          onConfirm: onConfirm,
          onCancel: onCancel,
          handleHidden: onCancel
        });

        React.renderComponent(modal, document.getElementById('modal'));
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
          that.dispatch(ProjectVolumeConstants.REMOVE_VOLUME_FROM_PROJECT, {
            volume: volume,
            project: project
          });

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

      attach: function(volume, project){

//        var attach = function(volume, instance, mountLocation){
//          volume.attachTo(instance, mountLocation, {
//            success: function (response) {
//              var title = "Volume successfully attached";
//              var successMessage = VolumeAttachNotifications.success();
//              NotificationController.success(title, successMessage);
//              VolumeStore.emitChange();
//            },
//            error: function (response) {
//              var title = "Volume could not be attached";
//              var errorMessage = VolumeAttachNotifications.error();
//              NotificationController.error(title, errorMessage);
//              VolumeStore.emitChange();
//            }
//          });
//        };

        var onConfirm = function (instance, mountLocation) {
          mountLocation = mountLocation || "";
          AppDispatcher.handleRouteAction({
            actionType: VolumeConstants.VOLUME_ATTACH,
            volume: volume,
            instance: instance,
            mountLocation: mountLocation
          });
        };

        var onCancel = function(){
          // Important! We need to un-mount the component so it un-registers from Stores and
          // also so that we can relaunch it again later.
          React.unmountComponentAtNode(document.getElementById('modal'));
        };

        var modal = VolumeAttachModal({
          header: "Attach Volume",
          volume: volume,
          confirmButtonMessage: "Attach volume to instance",
          onConfirm: onConfirm,
          onCancel: onCancel,
          handleHidden: onCancel,
          project: project
        });

        React.renderComponent(modal, document.getElementById('modal'));
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
            that.dispatch(ProjectVolumeConstants.ADD_VOLUME_TO_PROJECT, {
              volume: volume,
              project: project
            });

            volume.save(params).done(function () {
              NotificationController.success(null, 'Volume created');
              that.dispatch(VolumeConstants.UPDATE_VOLUME, {volume: volume});
              //pollUntilBuildIsFinished(volume);
            }).fail(function () {
              NotificationController.error(null, 'Volume could not be created');

              that.dispatch(VolumeConstants.REMOVE_VOLUME, {volume: volume});
              that.dispatch(ProjectVolumeConstants.REMOVE_VOLUME_FROM_PROJECT, {
                volume: volume,
                project: project
              });
            });
          }
        })

      }

    };

  });
