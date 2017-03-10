import ModalHelpers from "components/modals/ModalHelpers";
import InstanceResizeModal from "components/modals/instance/InstanceResizeModal";
import actions from "actions";


export default {

    resize: function(instance) {
        ModalHelpers.renderModal(InstanceResizeModal, null, function(resize_size) {
            actions.InstanceActions.resize({
                instance: instance,
                resize_size: resize_size
            });
        });
    }

};
