import ModalHelpers from "components/modals/ModalHelpers";
import ManageUserModal from "components/modals/admin/ManageUserModal";


export default {
    showModal: function(ident_member) {

        var props = {
            ident_member: ident_member,
            header: "Disable User"
        };

        return ModalHelpers.renderModal(ManageUserModal, props);
    }
};
