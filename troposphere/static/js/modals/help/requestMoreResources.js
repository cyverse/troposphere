import actions from "actions";
import globals from "globals";
import ModalHelpers from "components/modals/ModalHelpers";

import RequestMoreResourcesModal from "components/modals/RequestMoreResourcesModal";
import RequestMoreQuotaOrAllocationModal from "components/modals/RequestMoreQuotaOrAllocationModal";

// Based on the allocation strategy being used, we want to select
// the matching request-more-requests modal to be rendered
let RequestModal = globals.USE_ALLOCATION_SOURCES ?
                   RequestMoreQuotaOrAllocationModal :
                   RequestMoreResourcesModal;

export default {

    requestMoreResources: function() {
        ModalHelpers.renderModal(RequestModal, null, function(identity, quota, reason) {
            actions.HelpActions.requestMoreResources({
                identity,
                quota,
                reason
            });
        });
    }

};
