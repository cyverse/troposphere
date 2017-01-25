import ModalHelpers from "components/modals/ModalHelpers";
import InstanceResumeModal from "components/modals/instance/InstanceResumeModal";

import actions from "actions";


export default {
    /**
     * Resume any valid/actionable resources
     *
     * The action method handles resources verifying type (via instanceof)
     * to ensure that multi0ple resources can be handled.
     *
     * @param resources - collection of resources to act on
     */
    resume: function(resources) {
        let props = { resources };
        ModalHelpers.renderModal(InstanceResumeModal, props, function() {
            actions.InstanceActions.resume({ resources })
        });
    }

};
