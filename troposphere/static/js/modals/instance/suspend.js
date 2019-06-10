import ModalHelpers from "components/modals/ModalHelpers";

import InstanceSuspendModal from "components/modals/instance/InstanceSuspendModal";
import actions from "actions";

export default {
    suspend: function(instance) {
        ModalHelpers.renderModal(InstanceSuspendModal, {instance}, function() {
            actions.InstanceActions.suspend({
                instance: instance
            });
        });
    }
};
