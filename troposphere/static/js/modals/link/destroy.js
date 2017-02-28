import { browserHistory } from "react-router";

import ModalHelpers from "components/modals/ModalHelpers";
import ExternalLinkDeleteModal from "components/modals/link/ExternalLinkDeleteModal";

import actions from "actions";


export default {

    destroy: function(payload) {
        if (!payload.project)
            throw new Error("Missing project");
        if (!payload.external_link)
            throw new Error("Missing external_link");

        let external_link = payload.external_link;
        let project = payload.project;
        let props = {
            external_link
        };

        ModalHelpers.renderModal(ExternalLinkDeleteModal, props, function() {
            actions.ExternalLinkActions.destroy({
                project: project,
                external_link: external_link
            });
            browserHistory.push(`/projects/${project.id}/resources`);
        })
    }
};
