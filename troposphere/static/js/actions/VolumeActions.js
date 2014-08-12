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
    'controllers/NotificationController'
  ],
  function (React, AppDispatcher, VolumeConstants, ProjectVolumeConstants, CancelConfirmModal, VolumeDetachBody, VolumeDestroyBody, VolumeAttachModal, VolumeCreateModal, VolumeModalHelpers, NotificationController) {

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
        volume.set(newAttributes);
        AppDispatcher.handleRouteAction({
          actionType: VolumeConstants.VOLUME_UPDATE,
          volume: volume
        });
      },

      detach: function (volume) {

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

      create: function(){

        var onConfirm = function (volumeName, volumeSize, identity, project) {
          AppDispatcher.handleRouteAction({
            actionType: VolumeConstants.VOLUME_CREATE,
            volumeName: volumeName,
            volumeSize: volumeSize,
            identity: identity,
            project: project
          });
        };

        var onCancel = function(){
          // Important! We need to un-mount the component so it un-registers from Stores and
          // also so that we can relaunch it again later.
          React.unmountComponentAtNode(document.getElementById('modal'));
        };

        var modal = VolumeCreateModal({
          header: "Create Volume",
          confirmButtonMessage: "Create volume",
          onConfirm: onConfirm,
          onCancel: onCancel,
          handleHidden: onCancel
        });

        React.renderComponent(modal, document.getElementById('modal'));
      },

      createAndAddToProject: function(project){

        var onConfirm = function (volumeName, volumeSize, identity) {
          AppDispatcher.handleRouteAction({
            actionType: VolumeConstants.VOLUME_CREATE,
            volumeName: volumeName,
            volumeSize: volumeSize,
            identity: identity,
            project: project
          });
        };

        var onCancel = function(){
          // Important! We need to un-mount the component so it un-registers from Stores and
          // also so that we can relaunch it again later.
          React.unmountComponentAtNode(document.getElementById('modal'));
        };

        var modal = VolumeCreateModal({
          header: "Create Volume",
          confirmButtonMessage: "Create volume",
          onConfirm: onConfirm,
          onCancel: onCancel,
          handleHidden: onCancel
        });

        React.renderComponent(modal, document.getElementById('modal'));
      }

    };

  });
