import actions from 'actions';
import ModalHelpers from 'components/modals/ModalHelpers';
import NoAllocationSourceModal from 'components/modals/allocationSource/NoAllocationSourceModal.react';


export default {
    showModal: function (instancesToAssign, callback) {
      ModalHelpers.renderModal(NoAllocationSourceModal, function (instances) {
      });
    }
};
