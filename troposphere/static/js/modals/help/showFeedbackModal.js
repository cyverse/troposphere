import actions from "actions";
import ModalHelpers from "components/modals/ModalHelpers";

import FeedbackModal from "components/modals/FeedbackModal";


export default {
    showFeedbackModal: function() {

        var props = {
            header: "Send Feedback",
            confirmButtonMessage: "Send feedback"
        };

        ModalHelpers.renderModal(FeedbackModal, props, actions.HelpActions.sendFeedback);
    }
};
