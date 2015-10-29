import ModalHelpers from 'components/modals/ModalHelpers';
import VolumeAttachModal from 'components/modals/volume/VolumeAttachModal.react';
import actions from 'actions';

export default {
    attach: function(volume, project) {
      ModalHelpers.renderModal(
          // Modal to create
          VolumeAttachModal,

          // Modal properties
          {
              volume: volume,
              project: project
          },

          // This callback is the action fired in the modal
          function (instance, mountLocation) {
            actions.InstanceVolumeActions.attach({
              instance: instance,
              volume: volume,
              project: project,
              mountLocation: mountLocation
            })
          }
      )
    }
};
