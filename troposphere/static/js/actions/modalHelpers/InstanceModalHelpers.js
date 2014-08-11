define(
  [
    'react',
    './CommonHelpers',
    'components/modals/CancelConfirmModal.react',
    'components/modals/InstanceDeleteBody.react'
  ],
  function (React, CommonHelpers, CancelConfirmModal, InstanceDeleteBody) {

    return {

      terminate: function(payload, options){
        var instance = payload.instance;

        var modal = CancelConfirmModal({
          header: "Are you sure you want to terminate this instance?",
          confirmButtonMessage: "Yes, terminate this instance",
          onConfirm: options.onConfirm,
          body: InstanceDeleteBody.build(instance)
        });

        CommonHelpers.renderComponent(modal);
      }

    };

  });
