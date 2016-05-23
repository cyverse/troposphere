import ModalHelpers from 'components/modals/ModalHelpers';
import InstanceSuspendModal from 'components/modals/instance/InstanceSuspendModal.react';
import actions from 'actions';

export default {
    suspend: function (instance) {
      ModalHelpers.renderModal(InstanceSuspendModal, null, function () {
        actions.InstanceActions.suspend({
          instance: instance
        })
      });
    }
};
