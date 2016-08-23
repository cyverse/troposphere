import actions from 'actions';
import ModalHelpers from 'components/modals/ModalHelpers';
import VolumeCreateModal from 'components/modals/volume/VolumeCreateModal.react';

export default {
    createAndAddToProject: function (payload) {
      if (!payload.project) throw new Error("Missing project");

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
