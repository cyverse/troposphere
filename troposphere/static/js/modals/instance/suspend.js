import ModalHelpers from "components/modals/ModalHelpers";
import InstanceSuspendModal from "components/modals/instance/InstanceSuspendModal";

import actions from "actions";


export default {
    /**
     * Suspend any valid/actionable resources
     *
     * The action method handles resources by verifying type (via instanceof)
     * to ensure that multiple resources can be handled.
     *
     * These resources as passed to the modal as `props` so that they can be
     * optional displayed for clarity.
     *
     * @param resources - collection of resources to act on
     */
    suspend: function(resources) {
        let resourcesCopy = resources.clone(),
            props = { resources: resourcesCopy };

        ModalHelpers.renderModal(InstanceSuspendModal, props, function() {
            actions.InstanceActions.suspend({ resources: resourcesCopy });
        });
    }
};
