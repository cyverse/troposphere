import ModalHelpers from "components/modals/ModalHelpers";
import PublicSupportModal from "components/modals/PublicSupportModal";
import PublicLoginModal from "components/modals/PublicLoginModal";


export default {
    showPublicSupportModal: function() {
        ModalHelpers.renderModal(PublicSupportModal, {}, function() {});
    },
    showPublicLoginModal: function() {
        ModalHelpers.renderModal(PublicLoginModal, {}, function() {});
    }
};
