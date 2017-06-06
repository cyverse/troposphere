import actions from "actions";
import ModalHelpers from "components/modals/ModalHelpers";
import TagCreateModal from "components/modals/tag/TagCreateModal";


export default {
    create: function(initialTagName) {
        var props = {
            name: initialTagName
        };

        ModalHelpers.renderModal(TagCreateModal, props, function(name, description) {
            actions.TagActions.create({
                name: name,
                description: description
            });
        });
    }
};
