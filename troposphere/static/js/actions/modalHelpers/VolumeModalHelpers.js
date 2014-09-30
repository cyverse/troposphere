define(
  [
    'react',
    './CommonHelpers',
    'components/modals/CancelConfirmModal.react',
    'components/modals/volume/VolumeDetachBody.react',
    'components/modals/volume/VolumeDestroyBody.react',
    'components/modals/volume/VolumeAttachModal.react',
    'components/modals/volume/VolumeCreateModal.react',
    'components/modals/volume/VolumeAttachRulesModal.react'
  ],
  function (React, CommonHelpers, CancelConfirmModal, VolumeDetachBody, VolumeDestroyBody, VolumeAttachModal, VolumeCreateModal, VolumeAttachRulesModal) {

    return {

      destroy: function(payload, options){
        if(!options.onConfirm) throw new Error("Must supply options.onConfirm callback");

        var volume = payload.volume;

        var modal = CancelConfirmModal({
          header: "Delete Volume",
          confirmButtonMessage: "Yes, delete this volume",
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

        var modal = CancelConfirmModal({
          header: "Detach Volume",
          confirmButtonMessage: "Yes, detach the volume",
          body: VolumeDetachBody.build(volume),
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
