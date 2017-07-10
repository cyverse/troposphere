import actions from "actions";
import ModalHelpers from "components/modals/ModalHelpers";
import GroupEditModal from "components/modals/group/GroupEditModal";

export default {
    edit: function(props) {
        let group = props.group;
        ModalHelpers.renderModal(GroupEditModal, props, function(group_attrs) {
            actions.GroupActions.update(group, group_attrs);
        })

    }
};
