import Backbone from "backbone";

import InstanceConstants from "constants/InstanceConstants";
import Instance from "models/Instance";
import InstanceState from "models/InstanceState";
import InstanceActionRequest from "models/InstanceActionRequest";

import Utils from "../Utils";

/**
 * Defines the `start` steps for a single instance
 *
 * Only intended to handle "models/Instance" objects
 */
function handleOne(instance) {
    // if we've been passed a model via "selected resources" that
    // is *not* an Instance, then just skip it - _move on_
    if (!(instance instanceof Instance)) return;

    let instanceState = new InstanceState({
            status_raw: "shutoff - powering-on",
            status: "shutoff",
            activity: "powering-on"
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
            action: "start"
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
            title: "Your instance could not be started",
            response: response
        });
    }).always(function() {
        Utils.dispatch(InstanceConstants.UPDATE_INSTANCE, {
            instance: instance
        });
        Utils.dispatch(InstanceConstants.POLL_INSTANCE_WITH_DELAY, {
            instance: instance,
            delay: 25*1000,
        });
    });
}


export default {

    start: function(params) {
        if (!params.resources)
            throw new Error("Missing resources");
        if (params.instance)
            throw new Error("Deprecated parameter passed");

        // NOTE - we're passing a collection now ...
        let resources = params.resources;

        // in case "resources" is not a collection, but is
        // an Instance passed as `resources`, make a collection
        // and add the "models/Instance" to it
        if (resources instanceof Instance) {
            let instance = resources;
            resources = new Backbone.Collection(instance);
        }

        resources.map(handleOne);
    }

};
