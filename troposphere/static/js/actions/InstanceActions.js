define(
  [
    'dispatchers/AppDispatcher',
    'constants/InstanceConstants',
    'react',
    'components/modals/CancelConfirmModal.react',
    'components/modals/InstanceSuspendBody.react',
    'components/modals/InstanceResumeBody.react',
    'components/modals/InstanceStopBody.react',
    'components/modals/InstanceStartBody.react'
  ],
  function (AppDispatcher, InstanceConstants, React, CancelConfirmModal, InstanceSuspendBody, InstanceResumeBody, InstanceStopBody, InstanceStartBody) {

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
      },

      resume: function(instance){

        var onConfirm = function () {
          AppDispatcher.handleRouteAction({
            actionType: InstanceConstants.INSTANCE_RESUME,
            instance: instance
          });
        };

        var modal = CancelConfirmModal({
          header: "Resume Instance",
          confirmButtonMessage: "Resume Instance",
          onConfirm: onConfirm,
          body: InstanceResumeBody.build()
        });

        React.renderComponent(modal, document.getElementById('modal'));
      },

      stop: function(instance){

        var onConfirm = function () {
          AppDispatcher.handleRouteAction({
            actionType: InstanceConstants.INSTANCE_STOP,
            instance: instance
          });
        };

        var modal = CancelConfirmModal({
          header: "Stop Instance",
          confirmButtonMessage: "Stop Instance",
          onConfirm: onConfirm,
          body: InstanceStopBody.build()
        });

        React.renderComponent(modal, document.getElementById('modal'));
      },

      start: function(instance){

        var onConfirm = function () {
          AppDispatcher.handleRouteAction({
            actionType: InstanceConstants.INSTANCE_START,
            instance: instance
          });
        };

        var modal = CancelConfirmModal({
          header: "Start Instance",
          confirmButtonMessage: "Start Instance",
          onConfirm: onConfirm,
          body: InstanceStartBody.build()
        });

        React.renderComponent(modal, document.getElementById('modal'));
      }

    };

  });
