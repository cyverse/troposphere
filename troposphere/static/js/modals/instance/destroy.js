import { appBrowserHistory } from "utilities/historyFunctions";

// TODO - this is curious `stores` is not imported here
// and store.VolumeStore used in the exposed operation
import VolumeStore from "stores/VolumeStore";

import ModalHelpers from "components/modals/ModalHelpers";

import InstanceDeleteModal from "components/modals/instance/InstanceDeleteModal";
import ExplainInstanceDeleteConditionsModal from "components/modals/instance/ExplainInstanceDeleteConditionsModal";

import actions from "actions";


export default {
    destroy: function(payload, options) {
        if (!payload.instance)
            throw new Error("Missing instance");

        var project = payload.project,
            instance = payload.instance,
            attachedVolumes = VolumeStore.getVolumesAttachedToInstance(instance),
            ModalComponent,
            props = {
                instance,
                attachedVolumes
            };

        ModalComponent = attachedVolumes.length > 0
            ? ExplainInstanceDeleteConditionsModal
            : InstanceDeleteModal;

        ModalHelpers.renderModal(ModalComponent, props, function() {
            attachedVolumes.forEach((volume) => VolumeStore.pollUntilDetached(volume));
            actions.InstanceActions.destroy(payload, options);
            if (project) {
                appBrowserHistory.push(`/projects/${project.id}/resources`);
            }
        })
    }
}
