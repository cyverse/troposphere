import actions from "actions";
import ModalHelpers from "components/modals/ModalHelpers";

import ProjectCreateModal from "components/modals/project/ProjectCreateModal";


export default {
    create: function() {
        ModalHelpers.renderModal(ProjectCreateModal, null, function(name, description, groupOwner) {
            actions.ProjectActions.create({
                name: name,
                description: description,
                owner: groupOwner
            });
        })

    }
};
