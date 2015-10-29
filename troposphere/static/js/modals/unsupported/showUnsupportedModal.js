import actions from 'actions';
import ModalHelpers from 'components/modals/ModalHelpers';
import UnsupportedModal from 'components/modals/unsupported/UnsupportedModal.react';

export default {
    showModal: function (handler) {

      var props = {
        header: "Unsupported Features",
        closeUnsupportedModal: handler,
        backdrop:"static",
        keyboard:false
      };

      ModalHelpers.renderModal(UnsupportedModal, props, function () {
      });
    }
};
