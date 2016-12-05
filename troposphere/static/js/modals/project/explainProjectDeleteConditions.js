import ModalHelpers from "components/modals/ModalHelpers";

import ProjectDeleteConditionsModal from "components/modals/project/ProjectDeleteConditionsModal";


export default {
    explainProjectDeleteConditions: function() {
        ModalHelpers.renderModal(ProjectDeleteConditionsModal, null, function() {});
    }
}
