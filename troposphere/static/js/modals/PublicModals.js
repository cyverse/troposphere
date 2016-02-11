
import ModalHelpers from 'components/modals/ModalHelpers';
import PublicSupportModal from 'components/modals/PublicSupportModal.react';


export default {
    showPublicSupportModal: function() {
        ModalHelpers.renderModal(PublicSupportModal, {}, function(){});
    }
};
