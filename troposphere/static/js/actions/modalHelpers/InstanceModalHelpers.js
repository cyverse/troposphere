define(
  [
    'react',
    './CommonHelpers',
    'components/modals/CancelConfirmModal.react',
    'components/modals/InstanceSuspendBody.react',
    'components/modals/InstanceResumeBody.react',
    'components/modals/InstanceStopBody.react',
    'components/modals/InstanceStartBody.react',
    'components/modals/InstanceDeleteBody.react',
    'components/modals/InstanceLaunchModal.react'
  ],
  function (React, CommonHelpers, CancelConfirmModal, InstanceSuspendBody, InstanceResumeBody, InstanceStopBody, InstanceStartBody, InstanceDeleteBody, InstanceLaunchModal) {

    return {

      terminate: function(payload, options){
        if(!options.onConfirm) throw new Error("Must supply options.onConfirm callback");

        var instance = payload.instance;

        var modal = CancelConfirmModal({
          header: "Are you sure you want to terminate this instance?",
          confirmButtonMessage: "Yes, terminate this instance",
          body: InstanceDeleteBody.build(instance),
          onConfirm: options.onConfirm,
          onCancel: CommonHelpers.onCancel,
          handleHidden: CommonHelpers.onCancel
        });

        CommonHelpers.renderComponent(modal);
      },

      suspend: function (payload, options) {
        if(!options.onConfirm) throw new Error("Must supply options.onConfirm callback");

        var modal = CancelConfirmModal({
          header: "Suspend Instance",
          confirmButtonMessage: "Suspend Instance",
          onConfirm: options.onConfirm,
          onCancel: CommonHelpers.onCancel,
          handleHidden: CommonHelpers.onCancel,
          body: InstanceSuspendBody.build()
        });

        CommonHelpers.renderComponent(modal);
      },

      resume: function (payload, options) {
        if(!options.onConfirm) throw new Error("Must supply options.onConfirm callback");

        var modal = CancelConfirmModal({
          header: "Resume Instance",
          confirmButtonMessage: "Resume Instance",
          onConfirm: options.onConfirm,
          onCancel: CommonHelpers.onCancel,
          handleHidden: CommonHelpers.onCancel,
          body: InstanceResumeBody.build()
        });

        CommonHelpers.renderComponent(modal);
      },

      stop: function (payload, options) {
        if(!options.onConfirm) throw new Error("Must supply options.onConfirm callback");

        var modal = CancelConfirmModal({
          header: "Stop Instance",
          confirmButtonMessage: "Stop Instance",
          body: InstanceStopBody.build(),
          onConfirm: options.onConfirm,
          onCancel: CommonHelpers.onCancel,
          handleHidden: CommonHelpers.onCancel
        });

        CommonHelpers.renderComponent(modal);
      },

      start: function (payload, options) {
        if(!options.onConfirm) throw new Error("Must supply options.onConfirm callback");

        var modal = CancelConfirmModal({
          header: "Start Instance",
          confirmButtonMessage: "Start Instance",
          body: InstanceStartBody.build(),
          onConfirm: options.onConfirm,
          onCancel: CommonHelpers.onCancel,
          handleHidden: CommonHelpers.onCancel
        });

        CommonHelpers.renderComponent(modal);
      },

      launch: function (payload, options) {
        if(!options.onConfirm) throw new Error("Must supply options.onConfirm callback");

        var application = payload.application;

        var modal = InstanceLaunchModal({
          header: application.get('name'),
          application: application,
          confirmButtonMessage: "Launch instance",
          onConfirm: options.onConfirm,
          onCancel: CommonHelpers.onCancel,
          handleHidden: CommonHelpers.onCancel
        });

        CommonHelpers.renderComponent(modal);
      }

    };

  });
