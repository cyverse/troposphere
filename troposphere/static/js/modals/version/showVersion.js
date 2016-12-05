import ModalHelpers from "components/modals/ModalHelpers";

import VersionInformationModal from "components/modals/VersionInformationModal";


export default {
    showVersion: function() {
        var props = {
            header: "Atmosphere Version"
        };

        ModalHelpers.renderModal(VersionInformationModal, props, function() {});
    }
};
