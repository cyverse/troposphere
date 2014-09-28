define(
  [
    'react',
    './CommonHelpers',
    'components/modals/CancelConfirmModal.react',
    'components/modals/VolumeDetachBody.react',
    'components/modals/VolumeDestroyBody.react',
    'components/modals/VolumeAttachModal.react',
    'components/modals/VolumeCreateModal.react',
    'components/modals/VolumeAttachRulesModal.react'
  ],
  function (React, CommonHelpers, CancelConfirmModal, VolumeDetachBody, VolumeDestroyBody, VolumeAttachModal, VolumeCreateModal, VolumeAttachRulesModal) {

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
      },

      detach: function (payload, options) {
        if(!options.onConfirm) throw new Error("Must supply options.onConfirm callback");

        var volume = payload.volume;

        var headerMessage = "Detach volume " + volume.get('name') + "?";

        var modal = CancelConfirmModal({
          header: headerMessage,
          confirmButtonMessage: "Yes, detach this volume",
          body: VolumeDetachBody.build(),
          onConfirm: options.onConfirm,
          onCancel: CommonHelpers.onCancel,
          handleHidden: CommonHelpers.onCancel
        });

        CommonHelpers.renderComponent(modal);
      },

      attach: function(payload, options){
        if(!options.onConfirm) throw new Error("Must supply options.onConfirm callback");

        var volume = payload.volume;
        var project = payload.project;

        var modal = VolumeAttachModal({
          header: "Attach Volume",
          confirmButtonMessage: "Attach volume to instance",
          volume: volume,
          project: project,
          onConfirm: options.onConfirm,
          onCancel: CommonHelpers.onCancel,
          handleHidden: CommonHelpers.onCancel
        });

        CommonHelpers.renderComponent(modal);
      },

      explainAttachRules: function(payload, options){

        var modal = VolumeAttachRulesModal({
          header: "Volume Attach Rules",
          confirmButtonMessage: "Okay",
          handleHidden: CommonHelpers.onCancel,
          backdrop: 'static'
        });

        CommonHelpers.renderComponent(modal);
      },

      createAndAddToProject: function(payload, options){
        if(!options.onConfirm) throw new Error("Must supply options.onConfirm callback");

        var modal = VolumeCreateModal({
          header: "Create Volume",
          confirmButtonMessage: "Create volume",
          onConfirm: options.onConfirm,
          onCancel: CommonHelpers.onCancel,
          handleHidden: CommonHelpers.onCancel
        });

        CommonHelpers.renderComponent(modal);
      }

    };

  });
