import actions from "actions";
import ModalHelpers from "components/modals/ModalHelpers";

import ScriptEditModal from "components/modals/script/ScriptEditModal";


export default {
    edit: function(script) {
        var props = {
            script: script
        };

        ModalHelpers.renderModal(ScriptEditModal, props, function(script) {
            actions.ScriptActions.update({
                script,
            });
        });
    }
};
