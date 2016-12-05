import actions from "actions";
import VolumeStore from "stores/VolumeStore";
import ModalHelpers from "components/modals/ModalHelpers";

import InstanceDeleteModal from "components/modals/instance/InstanceDeleteModal";
import ExplainInstanceDeleteConditionsModal from "components/modals/instance/ExplainInstanceDeleteConditionsModal";
import Router from "Router";

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
                attachedVolumes,
            };

        ModalComponent = attachedVolumes.length > 0
            ? ExplainInstanceDeleteConditionsModal
            : InstanceDeleteModal;

        ModalHelpers.renderModal(ModalComponent, props, function() {
            attachedVolumes.forEach((volume) => VolumeStore.pollUntilDetached(volume));
            actions.InstanceActions.destroy(payload, options);
            if (project) {
                Router.getInstance().transitionTo("project-resources", {
                    projectId: project.id
                });
            }
        })
    },
}
