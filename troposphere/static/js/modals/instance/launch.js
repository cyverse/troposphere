import ModalHelpers from "components/modals/ModalHelpers";

import InstanceLaunchWizardModal from "components/modals/instance/InstanceLaunchWizardModal";


export default {

    launch: function(props) {
        ModalHelpers.renderModal(InstanceLaunchWizardModal, props, function(launchData) {

            //NOTE: Instance launch is handled in InstanceLaunchWizardModal
        });
    }
};
