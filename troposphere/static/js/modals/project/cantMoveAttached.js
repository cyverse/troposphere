import actions from 'actions';
import ModalHelpers from 'components/modals/ModalHelpers';
import CantMoveAttachedModal from 'components/modals/project/CantMoveAttachedModal.react';

export default {
    cantMoveAttached: function () {
      ModalHelpers.renderModal(CantMoveAttachedModal, null, function () {
      });
    }
}
