import Raven from "raven-js";

import Utils from "../Utils";
import InstanceConstants from "constants/InstanceConstants";
import NotificationController from "controllers/NotificationController";

export default function updateAllocationSource(params) {
    if (!params.instance)
        throw new Error("Missing instance");
    if (!params.allocationSource)
        throw new Error("Missing allocation source");

    let { instance, allocationSource } = params;
    let p = Promise.resolve(
        instance.save({"allocation_source": allocationSource}, { patch: true })
    ).then(() => {
        Utils.dispatch(InstanceConstants.UPDATE_INSTANCE, { instance });
    });

    let allocationName = allocationSource.get("name");
    let instanceName = instance.get("name");
    p.catch(response => {
        let err =
            `Assigning allocation source: "${allocationName}" to "${instanceName}" failed`;

        NotificationController.error(
            "Error assigning allocation source",
            err
        );
        if (Raven.isSetup()) {
            Raven.captureMessage(err);
        }

        // Components that are using an optimistic version of instance, need
        // to get sent the latest version of instance without the optimistic
        // change to allocation_source
        Utils.dispatch(InstanceConstants.UPDATE_INSTANCE, { instance });
    })

    return p;
}
