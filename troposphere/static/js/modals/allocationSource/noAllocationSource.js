import actions from 'actions';
import ModalHelpers from 'components/modals/ModalHelpers';
import NoAllocationSourceModal from 'components/modals/allocationSource/NoAllocationSourceModal.react';

export default {
    showModal: function (instances, callback) {
        ModalHelpers.renderModal(
            NoAllocationSourceModal,
            {
                backdrop: 'static',
                instances
            },
            callback
        );
    }
};
