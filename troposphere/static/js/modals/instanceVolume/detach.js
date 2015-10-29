import actions from 'actions';
import ModalHelpers from 'components/modals/ModalHelpers';
import VolumeDetachModal from 'components/modals/volume/VolumeDetachModal.react';

export default {
    detach: function (volume) {
      var props = {
        volume: volume
      };

      ModalHelpers.renderModal(VolumeDetachModal, props, function () {
        actions.InstanceVolumeActions.detach({
          volume: volume
        })
      })

    }
};
