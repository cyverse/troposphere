import actions from 'actions';
import stores from 'stores';
import ModalHelpers from 'components/modals/ModalHelpers';
import VolumeDetachModal from 'components/modals/volume/VolumeDetachModal.react';


export default {
    detach: function (volume) {
      var helpLink = stores.HelpLinkStore.get('volumes'),
        props = {
          volume: volume,
          helpLink: helpLink
        };

      ModalHelpers.renderModal(VolumeDetachModal, props, function () {
        actions.InstanceVolumeActions.detach({
          volume: volume,
          helpLink: helpLink
        })
      })

    }
};
