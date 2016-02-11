
import ModalHelpers from 'components/modals/ModalHelpers';
import PublicSupportModal from 'components/modals/PublicSupportModal.react';

/*
 I implement this without the severe nesting that other modals ´exhibit.
 Consider this a protest against the current approach.
 -- lenards
 */

export default {
    showPublicSupportModal: function() {
        ModalHelpers.renderModal(PublicSupportModal, {}, function(){});
    }
};
