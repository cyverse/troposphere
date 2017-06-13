import ModalHelpers from "components/modals/ModalHelpers";
import InstanceResizeModal from "components/modals/instance/InstanceResizeModal";
import actions from "actions";


export default {

    resize: function(instance, resize_type) {
        /**
         * 3 types of resize
         * null/resize -- Start resize instance process
         * revert - Revert a resized instance
         * confirm - Confirm a resized instance
         */
        let props = {
            instance: instance,
            type: resize_type
        };
        ModalHelpers.renderModal(InstanceResizeModal, props, function(resize_size) {
            if (resize_type == 'revert') {
                actions.InstanceActions.revertResize({
                    instance: instance
                });
            } else if (resize_type == 'confirm') {
                actions.InstanceActions.confirmResize({
                    instance: instance
                });
            } else {
                actions.InstanceActions.resize({
                    instance: instance,
                    resize_size: resize_size
                });
            }
        });
    }

};
