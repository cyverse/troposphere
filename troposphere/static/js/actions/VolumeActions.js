define(
  [
    'react',
    'dispatchers/AppDispatcher',
    'constants/VolumeConstants',
    'components/modals/CancelConfirmModal.react',
    'components/modals/VolumeDetachBody.react',
    'components/modals/VolumeDestroyBody.react',
    'components/modals/VolumeAttachModal.react',
    'components/modals/VolumeCreateModal.react'
  ],
  function (React, AppDispatcher, VolumeConstants, CancelConfirmModal, VolumeDetachBody, VolumeDestroyBody, VolumeAttachModal, VolumeCreateModal) {

    return {
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

        var headerMessage = "Detach volume " + volume.get('name_or_id') + "?";

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

      destroy: function (volume) {

        var onConfirm = function () {
          AppDispatcher.handleRouteAction({
            actionType: VolumeConstants.VOLUME_DESTROY,
            volume: volume
          });
        };

        var onCancel = function(){
          // Important! We need to un-mount the component so it un-registers from Stores and
          // also so that we can relaunch it again later.
          React.unmountComponentAtNode(document.getElementById('modal'));
        };

        var modal = CancelConfirmModal({
          header: "Destroy this volume?",
          confirmButtonMessage: "Yes, destroy this volume",
          body: VolumeDestroyBody.build(volume),
          onConfirm: onConfirm,
          onCancel: onCancel,
          handleHidden: onCancel
        });

        React.renderComponent(modal, document.getElementById('modal'));
      },

      attach: function(volume){

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
          handleHidden: onCancel
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

//      createAndAddToProject: function(project){
//
//        var onConfirm = function (volumeName, volumeSize, identity) {
//
//          var volumeParams = {
//            volumeName: volumeName,
//            volumeSize: volumeSize,
//            identity: identity
//          };
//
//          AppDispatcher.handleRouteAction({
//            actionType: ProjectConstants.PROJECT_CREATE_VOLUME_AND_ADD_TO_PROJECT,
//            project: project,
//            volumeParams: volumeParams
//          });
//        };
//
//        var onCancel = function(){
//          // Important! We need to un-mount the component so it un-registers from Stores and
//          // also so that we can relaunch it again later.
//          React.unmountComponentAtNode(document.getElementById('modal'));
//        };
//
//        var modal = VolumeCreateModal({
//          header: "Create Volume",
//          confirmButtonMessage: "Create volume",
//          onConfirm: onConfirm,
//          onCancel: onCancel,
//          handleHidden: onCancel
//        });
//
//        React.renderComponent(modal, document.getElementById('modal'));
//      }

    };

  });
