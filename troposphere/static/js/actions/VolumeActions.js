define(
  [
    'react',
    'dispatchers/AppDispatcher',
    'constants/VolumeConstants',
    'components/modals/CancelConfirmModal.react',
    'components/modals/VolumeDetachBody.react',
    'components/modals/VolumeDestroyBody.react'
  ],
  function (React, AppDispatcher, VolumeConstants, CancelConfirmModal, VolumeDetachBody, VolumeDestroyBody) {

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
      }

    };

  });
