import actions from "actions";
import ModalHelpers from "components/modals/ModalHelpers";
import GroupCreateModal from "components/modals/group/GroupCreateModal";

export default {
    create: function() {
        ModalHelpers.renderModal(GroupCreateModal, null, function(group_attrs) {
            actions.GroupActions.create(group_attrs);
        })

    }
};
