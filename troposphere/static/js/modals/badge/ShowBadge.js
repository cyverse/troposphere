import ModalHelpers from "components/modals/ModalHelpers";
import BadgeModal from "components/modals/BadgeModal.react";

export default {
    ShowBadge: function(badge) {
        ModalHelpers.renderModal(BadgeModal, {
            badge: badge
        }, function() {});
    }
};
