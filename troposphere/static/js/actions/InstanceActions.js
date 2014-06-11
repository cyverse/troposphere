define(
  [
    'dispatchers/AppDispatcher',
    'constants/InstanceConstants',
    'react',
    'components/modals/CancelConfirmModal.react',
    'components/modals/InstanceSuspendBody.react',
    'components/modals/InstanceResumeBody.react',
    'components/modals/InstanceStopBody.react',
    'components/modals/InstanceStartBody.react',
    'components/modals/InstanceTerminateBody.react',
    'components/modals/instance_launch/InstanceLaunchBody.react'
  ],
  function (AppDispatcher, InstanceConstants, React, CancelConfirmModal, InstanceSuspendBody, InstanceResumeBody, InstanceStopBody, InstanceStartBody, InstanceTerminateBody, InstanceLaunchBody) {

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
      },

      terminate: function(instance){

        var onConfirm = function () {
          AppDispatcher.handleRouteAction({
            actionType: InstanceConstants.INSTANCE_TERMINATE,
            instance: instance
          });
          // Since this is triggered from the instance details page, navigate off
          // that page and back to the instance list
          Backbone.history.navigate('instances', {trigger: true});
        };

        var modal = CancelConfirmModal({
          header: "Are you sure you want to terminate this instance?",
          confirmButtonMessage: "Yes, terminate this instance",
          onConfirm: onConfirm,
          body: InstanceTerminateBody.build(instance)
        });

        React.renderComponent(modal, document.getElementById('modal'));
      },

      launch: function(application, identities, providers){

        var onConfirm = function (instance) {
          AppDispatcher.handleRouteAction({
            actionType: InstanceConstants.INSTANCE_LAUNCH,
            instance: instance
          });
          // Since this is triggered from the images page, navigate off
          // that page and back to the instance list so the user can see
          // their instance being created
          Backbone.history.navigate('instances', {trigger: true});
        };

        var modal = CancelConfirmModal({
          header: application.get('name_or_id'),
          confirmButtonMessage: "Launch Instance",
          onConfirm: onConfirm,
          body: InstanceLaunchBody.build(application, identities, providers)
        });

        React.renderComponent(modal, document.getElementById('modal'));
      }

    };

  });
