import ModalHelpers from "components/modals/ModalHelpers";

import CantMoveAttachedModal from "components/modals/project/CantMoveAttachedModal";


export default {
    cantMoveAttached: function() {
        ModalHelpers.renderModal(CantMoveAttachedModal, null, function() {});
    }
}
