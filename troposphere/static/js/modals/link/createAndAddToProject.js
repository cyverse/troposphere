import actions from "actions";
import ModalHelpers from "components/modals/ModalHelpers";
import ExternalLinkCreateModal from "components/modals/link/ExternalLinkCreateModal.react";

export default {

    createAndAddToProject: function(initialExternalLinkName, project) {
        var props = {
            initialExternalLinkName,
            project
        };

        ModalHelpers.renderModal(ExternalLinkCreateModal, props, function(name, description, link) {
            actions.ExternalLinkActions.createAndAddToProject({
                title: name,
                description: description,
                external_link: link,
                project: project
            });
        });
    }
};
