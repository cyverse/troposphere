import { appBrowserHistory } from "utilities/historyFunctions";

// TODO - this is curious `stores` is not imported here
// and store.VolumeStore used in the exposed operation
import VolumeStore from "stores/VolumeStore";

import ModalHelpers from "components/modals/ModalHelpers";

import BatchInstanceDeleteModal from "components/modals/instance/BatchInstanceDeleteModal";
import InstanceDeleteModal from "components/modals/instance/InstanceDeleteModal";
import ExplainInstanceDeleteConditionsModal from "components/modals/instance/ExplainInstanceDeleteConditionsModal";

import actions from "actions";
import features from "utilities/featureFlags";


function selectModal(props) {
    let { attachedVolumes } = props;

    if (features.BATCH_RESOURCE_ACTIONS) {
        // offer a "best offer" approach to deleting
        // the instances selected that don't have
        // attached volumes; here, "best offer" means
        // to delete what we can & apologize/explain
        // why we don't be deleting the others
        return BatchInstanceDeleteModal;
    } else {
        // when batch resource actions are disabled,
        // if we have volumes attached to the instance
        // targeted for deletion, we offer a "polite"
        // explanation for why the UI doesn't let that
        // happen; otherwise, delete delete delete!
        return (attachedVolumes && attachedVolumes.length > 0)
            ? ExplainInstanceDeleteConditionsModal
            : InstanceDeleteModal;
    }
}


export default {
    destroy: function(payload, options) {
        if (!payload.instances)
            throw new Error("Missing instance(s)");

        let project = payload.project,
            instances = payload.instances,
            onUnselect = payload.onUnselect,
            attachedResults = VolumeStore.getVolumesAttachedToInstances(instances),
            { volumes: attachedVolumes,
              matchedIds } = attachedResults,
            props = {
                instances: instances.creject((i) => matchedIds.includes(i.get("uuid"))),
                rejected: instances.cfilter((i) => matchedIds.includes(i.get("uuid"))),
                attachedVolumes,
                matchedIds
            };

        ModalHelpers.renderModal(selectModal(props), props, function() {
            // destroy all instances without attached volumes ...
            actions.InstanceActions.destroy(props, options);

            if (onUnselect) {
                onUnselect();
            }
            if (project) {
                appBrowserHistory.push(`/projects/${project.id}/resources`);
            }
        })
    }
}
