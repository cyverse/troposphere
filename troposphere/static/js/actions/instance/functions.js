import InstanceConstants from "constants/InstanceConstants";
import InstanceState from "models/InstanceState";
import InstanceActionRequest from "models/InstanceActionRequest";

import Utils from "../Utils";

import globals from "globals";

// we define a "function" constructor that will create a closure for an actionName
// and the closure will take one argument, the instance

/**
 * Creates an instance action `function` to carry out an HTTP DELETE on each
 * instance that is passed into the resulting function.
 *
 * Currently, the Atmosphere API does not allow a "terminate" (aka delete, aka
 * destroy) to be processed by the `run_instance_action` function defined in
 * service/instance.py. It would seem since there is a convention in the API
 * _not_ to "delete" but to "end date" - you _could_ make an
 * InstanceActionRequest that would do a "end date" and, thus, delete. There
 * may be some _secret_ knowledge I lack for understanding why a "terminate"
 * is processed as a special case, and via HTTP DELETE. I wish I knew to ask
 * this of Steve Gregory before his departure.
 *
 * The original design was to make "terminate" a possible InstanceActionRequest,
 * like so: https://gist.github.com/lenards/85df742edebc596a5b86b646d8c5a145
 *
 * Some plans don't work and I held onto it for _too_ long.
 *
 * This function's _specialness_ is hidden within the instanceActionImpl(..)
 * so that progress in supporting Delete All can be provided to the community
 * without having to wait for a major rework/remodel/rethink.
 *
 * Le mieux est l'ennemi du bien.
 *
 * @lenards
 */
const deleteActionImpl = (actionName, desiredState, errorMsg, delayOptions) => {

    return function(instance) {

        let originalState = instance.get("state"),
            instanceState = instanceState = new InstanceState(desiredState),
            identity = instance.get("identity"),
            provider = instance.get("provider"),
            url = (
                globals.API_ROOT +
                "/provider/" + provider.uuid +
                "/identity/" + identity.uuid +
                "/instance/" + instance.get("uuid")
            );

        // Optimistic update to the desiredState ...
        instance.set({
            state: instanceState,

        });
        // Optimistic "delete" is really just an end-date operation
        instance.set({
            end_date: new Date()
        });

        // Dispatch an UPDATE INSTANCE for what was just done above
        Utils.dispatch(InstanceConstants.UPDATE_INSTANCE, {
            instance: instance
        });

        // Perform an HTTP DELETE on the model (why this is done &
        // it is not just an InstanceActionRequest has not been
        // captured in the codebase nor documentation)
        instance.destroy({
            url: url
        }).done(function() {
            Utils.dispatch(InstanceConstants.POLL_FOR_DELETED, {
                instance: instance
            });
        }).fail(function(response) {
            // if something goes bump, flip it back to original state
            instance.set({
                state: originalState
            });
            Utils.dispatch(InstanceConstants.UPDATE_INSTANCE, {
                instance: instance
            });
            Utils.dispatch(InstanceConstants.POLL_INSTANCE, {
                instance: instance
            });
            Utils.displayError({
                title: errorMsg,
                response: response
            });
        });
    }
}


/**
 * Creates an instance action `function` to carry out `actionName`
 *
 * The function returned will carry out an _action_ for a single instance.
 */
const instanceActionImpl = (actionName, desiredState, errorMsg, delayOptions) => {
    delayOptions = delayOptions || { delay: 25*1000 };

    // return a "delete" version for now ...
    if (actionName === "terminate") {
        return deleteActionImpl(actionName, desiredState, errorMsg, delayOptions);
    }

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

    return function({ instances }, options) {
        if (!instances)
            throw new Error("Missing instances parameter");

        instances.map(instanceAction)
    }
}

export { applyInstanceAction };
