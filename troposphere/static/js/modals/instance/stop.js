import ModalHelpers from "components/modals/ModalHelpers";

import InstanceStopModal from "components/modals/instance/InstanceStopModal";
import actions from "actions";

export default {
    stop: function(instance) {
        ModalHelpers.renderModal(InstanceStopModal, {instance}, function() {
            actions.InstanceActions.stop({
                instance: instance
            });
        });
    }
};
