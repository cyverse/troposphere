import actions from "actions";
import ModalHelpers from "components/modals/ModalHelpers";

import InstanceLaunchWizardModal from "components/modals/instance/InstanceLaunchWizardModal";


export default {

    launch: function(props) {
        ModalHelpers.renderModal(InstanceLaunchWizardModal, props, function(launchData) {
            var size = launchData.size,
                version = launchData.version,
                identity = launchData.identity,
                name = launchData.name,
                project = launchData.project;

            actions.InstanceActions.launch({
                project: project,
                instanceName: name,
                identity: identity,
                size: size,
                version: version
            });
        });
    }
};
