import InstanceConstants from "constants/InstanceConstants";
import Instance from "models/Instance";
import InstanceState from "models/InstanceState";
import InstanceActionRequest from "models/InstanceActionRequest";

import Utils from "../Utils";

// we define a "function" constructor that will create a closure for an actionName
// and the closure will take one argument, the instance

/**
 * Creates an instance action `function` to carry out `actionName`
 *
 * The function returned will carry out an _action_ for a single instance.
 */
const instanceActionImpl = (actionName, desiredState, errorMsg, delayOptions) => {
    delayOptions = delayOptions || { delay: 25*1000 };

    return function(instance) {
        let instanceState = new InstanceState(desiredState),
            isDeleteAction = actionName === "terminate",
            originalState = instance.get("state"),
            actionRequest = new InstanceActionRequest({
                instance: instance
            });

        instance.set({
            state: instanceState
        });

        if (isDeleteAction) {
            instance.set({
                end_date: new Date()
            });
        }

        Utils.dispatch(InstanceConstants.UPDATE_INSTANCE, {
            instance: instance
        });

        actionRequest.save(null, {
            attrs: {
                action: actionName
            }
        }).done(function() {
            instance.set({
                state: instanceState
            });

            if (isDeleteAction) {
                Utils.dispatch(InstanceConstants.POLL_FOR_DELETED, {
                    instance: instance
                });
            }
        }).fail(function(response) {
            instance.set({
                state: originalState
            });
            Utils.displayError({
                title: errorMsg,
                response: response
            });
        }).always(function() {
            Utils.dispatch(InstanceConstants.UPDATE_INSTANCE, {
                instance: instance
            });

            if (delayOptions.delay > 0) {
                Utils.dispatch(InstanceConstants.POLL_INSTANCE_WITH_DELAY, {
                    instance: instance,
                    delay: delayOptions.delay,
                });
            } else {
                Utils.dispatch(InstanceConstants.POLL_INSTANCE, {
                    instance: instance
                });
            }
        });
    }
}


/**
 * Applies the created instance action to all instances passed via `params`
 *
 * Expects an object with an `instances` property that is a 'mappable'
 * collections of instances. The `actionName` is requested for all instances.
 */
const applyInstanceAction = (actionName, desiredState, errorMsg, delayOptions) => {
    let instanceAction = instanceActionImpl(
        actionName,
        desiredState,
        errorMsg,
        delayOptions);

    return function({ instances }) {
        if (!instances)
            throw new Error("Missing instances parameter");

        instances.map(instanceAction)
    }
}

export { applyInstanceAction };
