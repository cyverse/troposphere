define(
  [
    'dispatchers/AppDispatcher',
    'constants/InstanceConstants',
    'react',
    'components/modals/CancelConfirmModal.react',
    'components/modals/InstanceSuspendBody.react'
  ],
  function (AppDispatcher, InstanceConstants, React, CancelConfirmModal, InstanceSuspendBody) {

    return {
      suspend: function (instance) {

        var onConfirm = function () {
          AppDispatcher.handleRouteAction({
            actionType: InstanceConstants.INSTANCE_SUSPEND,
            instance: instance
          });
        };

        var modal = CancelConfirmModal({
          header: "Suspend Instance",
          confirmButtonMessage: "Suspend Instance",
          onConfirm: onConfirm,
          body: InstanceSuspendBody.build()
        });

        React.renderComponent(modal, document.getElementById('modal'));
      }
    };

  });
