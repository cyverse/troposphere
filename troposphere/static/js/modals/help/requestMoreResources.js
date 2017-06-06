import actions from "actions";
import ModalHelpers from "components/modals/ModalHelpers";

import RequestMoreResourcesModal from "components/modals/RequestMoreResourcesModal";

// HOTFIX: show the NON-Jetstream modal ;__;
let RequestModal = RequestMoreResourcesModal;

export default {

    requestMoreResources: function(props) {
        ModalHelpers.renderModal(RequestModal, props, function(identity, quota, reason) {
            actions.HelpActions.requestMoreResources({
                identity,
                quota,
                reason
            });
        });
    }

};
