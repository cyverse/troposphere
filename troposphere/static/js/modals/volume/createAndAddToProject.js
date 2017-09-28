import ModalHelpers from "components/modals/ModalHelpers";

import VolumeCreateModal from "components/modals/volume/VolumeCreateModal";


export default {
    createAndAddToProject: function(props) {
        if (!props.project)
            throw new Error("Missing project");

        ModalHelpers.renderModal(VolumeCreateModal, props, function(createData) {
            //NOTE: Volume creation is handled in VolumeCreateModal
        });
    }
};
