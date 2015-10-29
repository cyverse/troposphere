import ModalHelpers from 'components/modals/ModalHelpers';
import InstanceRebootModal from 'components/modals/instance/InstanceRebootModal.react';
import actions from 'actions';

export default {

    reboot: function (instance) {
      ModalHelpers.renderModal(InstanceRebootModal, null, function (reboot_type) {
        actions.InstanceActions.reboot({
          instance: instance,
          reboot_type: reboot_type,
        });
      });
    }

};
