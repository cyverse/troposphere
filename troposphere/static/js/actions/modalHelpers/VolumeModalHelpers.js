define(
  [
    'react',
    './CommonHelpers',
    'components/modals/CancelConfirmModal.react',
    'components/modals/VolumeDestroyBody.react'
  ],
  function (React, CommonHelpers, CancelConfirmModal, VolumeDestroyBody) {

    return {

      destroy: function(payload, options){
        if(!options.onConfirm) throw new Error("Must supply options.onConfirm callback");

        var volume = payload.volume;

        var modal = CancelConfirmModal({
          header: "Are you sure you want to terminate this instance?",
          confirmButtonMessage: "Yes, terminate this instance",
          body: VolumeDestroyBody.build(volume),
          onConfirm: options.onConfirm,
          onCancel: CommonHelpers.onCancel,
          handleHidden: CommonHelpers.onCancel
        });

        CommonHelpers.renderComponent(modal);
      }

    };

  });
