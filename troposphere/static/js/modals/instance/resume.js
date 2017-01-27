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
        // `resources` is a reference to the "selected" resources we are
        // acting on; it's `props` - we know that it could be mutated by
        // the owner - so we are going to clone this to avoid it changing
        // out from under the modal/action calls
        //
        // ^ if you think this sounds totally wrong, track down @lenards
        //   and set me straight ...
        let resourcesCopy = resources.clone(),
            props = { resources: resourcesCopy };

        ModalHelpers.renderModal(InstanceResumeModal, props, function() {
            actions.InstanceActions.resume({ resources: resourcesCopy });
        });
    }

};
