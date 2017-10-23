import ModalHelpers from "components/modals/ModalHelpers";

import InstanceShareModal from "components/modals/instance/InstanceShareModal";
import actions from "actions";


export default {
    share: function(instance) {
        ModalHelpers.renderModal(InstanceShareModal, { instance }, function({ user }) {
            console.log(instance, user);
            // Send action to subspace: share with instanceUsers (And remove with any who have been removed)
            actions.InstanceActions.createShareRequest({
                instance: instance,
                user: user
            });
        });
    }
};
