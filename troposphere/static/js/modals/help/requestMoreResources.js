import actions from "actions";
import ModalHelpers from "components/modals/ModalHelpers";

import RequestMoreResourcesModal from "components/modals/RequestMoreResourcesModal";


export default {

    requestMoreResources: function() {
        ModalHelpers.renderModal(RequestMoreResourcesModal, null, function(identity, quota, reason) {
            actions.HelpActions.requestMoreResources({
                identity,
                quota,
                reason
            });
        });
    }

};
