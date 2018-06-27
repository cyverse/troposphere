import ModalHelpers from "components/modals/ModalHelpers";

import InstanceShelveModal from "components/modals/instance/InstanceShelveModal";
import actions from "actions";

export default {
    shelve: function(instance) {
        ModalHelpers.renderModal(InstanceShelveModal, null, function() {
            actions.InstanceActions.shelve({
                instance: instance
            });
        });
    }
};
