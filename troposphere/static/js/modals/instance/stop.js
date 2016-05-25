import ModalHelpers from 'components/modals/ModalHelpers';
import InstanceStopModal from 'components/modals/instance/InstanceStopModal.react';
import actions from 'actions';

export default {
    stop: function (instance) {
      ModalHelpers.renderModal(InstanceStopModal, null, function () {
        actions.InstanceActions.stop({
          instance: instance
        });
      })
    }
};
