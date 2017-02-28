import { browserHistory } from "react-router";

import ModalHelpers from "components/modals/ModalHelpers";

import VolumeDeleteModal from "components/modals/volume/VolumeDeleteModal";
import ExplainVolumeDeleteConditionsModal from "components/modals/volume/ExplainVolumeDeleteConditionsModal";

import actions from "actions";
import stores from "stores";


export default {
    destroy: function(payload, options) {
        if (!payload.project)
            throw new Error("Missing project");
        if (!payload.volume)
            throw new Error("Missing volume");

        var project = payload.project,
            volume = payload.volume,
            instanceUUID = volume.get("attach_data").instance_id,
            isAttached = !!instanceUUID,
            ModalComponent,
            props;

        if (isAttached) {
            ModalComponent = ExplainVolumeDeleteConditionsModal;
            props = {
                volume: volume,
                instance: stores.InstanceStore.getAll().findWhere({
                    uuid: instanceUUID
                })
            };
        } else {
            ModalComponent = VolumeDeleteModal;
            props = {
                volume: volume
            };
        }

        ModalHelpers.renderModal(ModalComponent, props, function() {
            if (isAttached) return;
            actions.VolumeActions.destroy({
                project: project,
                volume: volume
            });

            browserHistory.push(`/projects/${project.id}/resources`);
        })
    }
};
