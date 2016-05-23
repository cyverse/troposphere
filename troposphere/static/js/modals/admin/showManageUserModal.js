import actions from 'actions';
import ModalHelpers from 'components/modals/ModalHelpers';
import ManageUserModal from 'components/modals/admin/ManageUserModal.react';


export default {
    showModal: function (ident_member) {

      var props = {
          ident_member: ident_member,
          header: "Disable User"
      };

      ModalHelpers.renderModal(ManageUserModal, props, function () {
      });
    }
};
