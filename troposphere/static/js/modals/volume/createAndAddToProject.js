define(function (require) {

  var actions = require('actions'),
      ModalHelpers = require('components/modals/ModalHelpers'),
      VolumeCreateModal = require('components/modals/volume/VolumeCreateModal.react');

  return {

    createAndAddToProject: function(payload){
      if(!payload.project) throw new Error("Missing project");

      var project = payload.project;

      ModalHelpers.renderModal(VolumeCreateModal, null, function (volumeName, volumeSize, identity) {
        actions.VolumeActions.createAndAddToProject({
          volumeName: volumeName,
          volumeSize: volumeSize,
          identity: identity,
          project: project
        })
      })

    }

  };

});
