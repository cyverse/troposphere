import Backbone from "backbone";

import InstanceConstants from "constants/InstanceConstants";
import Instance from "models/Instance";
import InstanceState from "models/InstanceState";
import InstanceActionRequest from "models/InstanceActionRequest";

import Utils from "../Utils";


/**
 * Defines the `suspend` steps for a single instance
 */
function handleOne(instance) {
    // if we've been passed a model via "selected resources" that
    // is *not* an Instance, then just skip it - _move on_
    if (!(instance instanceof Instance)) return;

    let instanceState = new InstanceState({
            status_raw: "active - suspending",
            status: "active",
            activity: "suspending"
        }),
        originalState = instance.get("state"),
        actionRequest = new InstanceActionRequest({
            instance: instance
        });

    instance.set({
        state: instanceState
    });

    Utils.dispatch(InstanceConstants.UPDATE_INSTANCE, {
        instance: instance
    });

    actionRequest.save(null, {
        attrs: {
            action: "suspend"
        }
    }).done(function() {
        // Consider "success" notification ...
        instance.set({
            state: instanceState
        });
    }).fail(function(response) {
        instance.set({
            state: originalState
        });
        Utils.displayError({
            title: "Your instance could not be suspended",
            response: response
        });
    }).always(function() {
        Utils.dispatch(InstanceConstants.UPDATE_INSTANCE, {
            instance: instance
        });
        Utils.dispatch(InstanceConstants.POLL_INSTANCE_WITH_DELAY, {
            instance: instance,
            delay: 15*1000,
        });
    });
}


export default {

    suspend: function(params) {
        if (!params.resources)
            throw new Error("Missing resources");
        if (params.instance)
            throw new Error("Deprecated parameter passed");

        // NOTE - we're passing a collection now ...
        let resources = params.resources;

        // in cases it is not a collection, make one & add it
        if (resources instanceof Instance) {
            let instance = resources;
            resources = new Backbone.Collection(instance);
        }

        resources.map(handleOne);

    }

};
