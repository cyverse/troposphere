define(function (require) {
  "use strict";

  var ModalHelpers = require('components/modals/ModalHelpers'),
    InstanceImageWizardModal = require('components/modals/instance/InstanceImageWizardModal.react'),
    actions = require('actions');

  return {

    requestImage: function (params) {
      if (!params.instance) throw new Error("Missing instance");

      var instance = params.instance,
        props = {
          instance: instance,
          imageOwner: instance.get('image').user == instance.get('user').id
          //NOTE:onConfirm set in function below, as part of ModalHelpers.renderModal
        };

      ModalHelpers.renderModal(InstanceImageWizardModal, props, function (params) {
        actions.InstanceActions.requestImage({
          instance: instance,
          identity: instance.get('identity').id,
          name: params.name,
          description: params.description,
          tags: params.tags,
          versionName: params.versionName,
          minMem: params.minMem,
          minStorage: params.minStorage,
          versionChanges: params.versionChanges,
          newMachineOwner: instance.get('user').id,
          versionFork: params.newImage,
          providerId: params.providerId,
          visibility: params.visibility,
          imageUsers: params.imageUsers,
          filesToExclude: params.filesToExclude || "",
          software: params.software || "",
          systemFiles: params.systemFiles || "",
          scripts: params.scripts,
          licenses: params.licenses
        });
      })
    }

  };

});
