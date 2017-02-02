import ModalHelpers from "components/modals/ModalHelpers";
import InstanceStartModal from "components/modals/instance/InstanceStartModal";

import actions from "actions";


export default {
    /**
     * Start any valid/actionable resources
     *
     * @param resources - collection of resources to act on
     */
    start: function(resources) {
        let resourcesCopy = resources.clone(),
            props = { resources: resourcesCopy };

        ModalHelpers.renderModal(InstanceStartModal, props, function() {
            actions.InstanceActions.start({ resources: resourcesCopy })
        });
    }

};
