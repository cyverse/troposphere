import ModalHelpers from "components/modals/ModalHelpers";
import InstanceStopModal from "components/modals/instance/InstanceStopModal";

import actions from "actions";


export default {
    /**
     * Stop any valid/actionable resources
     *
     * @param resources - collection of resources to act on
     */
    stop: function(resources) {

        let resourcesCopy = resources.clone(),
            props = { resources: resourcesCopy };

        ModalHelpers.renderModal(InstanceStopModal, props, function() {
            actions.InstanceActions.stop({ resources: resourcesCopy });
        })
    }
};
