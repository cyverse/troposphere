import actions from "actions";
import ModalHelpers from "components/modals/ModalHelpers";
import ProviderCreateModal from "components/modals/provider/ProviderCreateModal";

export default {
    create: function() {
        ModalHelpers.renderModal(ProviderCreateModal, null, function(provider_attrs) {
            actions.ProviderActions.create(provider_attrs);
        })

    }
};
