import { applyInstanceAction } from "./functions.js";


/**
 * Defines the "terminate" ation for a collection of instances
 *
 * We expect `params` to be an object with an `instances` property
 * providing access to a mappable collection of instance models.
 */
const destroy = (params, options) => {
    let instanceTerminate = applyInstanceAction(
        "terminate",
        {
            status_raw: "active - deleting",
            status: "active",
            activity: "deleting"
        },
        "Your instance(s) could not be deleted"
    );

    instanceTerminate(params, options);
}


export { destroy };
