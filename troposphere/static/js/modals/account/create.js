import actions from "actions";
import ModalHelpers from "components/modals/ModalHelpers";
import AccountCreateModal from "components/modals/account/AccountCreateModal";

export default {
    create: function() {
        ModalHelpers.renderModal(AccountCreateModal, null, function(provider_attrs) {
            actions.AccountActions.create(provider_attrs);
        })

    }
};
