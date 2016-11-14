
import ModalHelpers from "components/modals/ModalHelpers";
import PublicSupportModal from "components/modals/PublicSupportModal";


export default {
    showPublicSupportModal: function() {
        ModalHelpers.renderModal(PublicSupportModal, {}, function() {});
    }
};
