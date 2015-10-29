import ModalHelpers from 'components/modals/ModalHelpers';
import InstanceStartModal from 'components/modals/instance/InstanceStartModal.react';
import actions from 'actions';

export default {

    start: function (instance) {
      ModalHelpers.renderModal(InstanceStartModal, null, function () {
        actions.InstanceActions.start({
          instance: instance
        })
      });
    }

};
