import actions from "actions";
import ModalHelpers from "components/modals/ModalHelpers";
import ScriptCreateModal from "components/modals/script/ScriptCreateModal";


export default {
    create: function() {
        var props = {};

        ModalHelpers.renderModal(ScriptCreateModal, props, function(title, text) {
            actions.ScriptActions.create({
                // ...
                title: name,
                text: text
            });
        });
    }
};
