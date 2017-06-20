import actions from "actions";
import ModalHelpers from "components/modals/ModalHelpers";

// FIXME:
// imports will need to be configuration-driven in the future
import RequestMoreResourcesModal from "components/modals/RequestMoreQuotaOrAllocationModal";

// FIXME: show the Jetstream modal ;__;
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
