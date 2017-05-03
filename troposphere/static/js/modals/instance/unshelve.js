import ModalHelpers from "components/modals/ModalHelpers";

import InstanceUnshelveModal from "components/modals/instance/InstanceUnshelveModal";
import actions from "actions";


export default {
    unshelve: function(instance) {
        ModalHelpers.renderModal(InstanceUnshelveModal, null, function() {
            actions.InstanceActions.unshelve({
                instance: instance
            })
        });
    }
};
