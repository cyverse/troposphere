import InstanceConstants from "constants/InstanceConstants";
import InstanceState from "models/InstanceState";
import Utils from "../Utils";
import InstanceActionRequest from "models/InstanceActionRequest";

export default {

    resize: function(params) {
        if (!params.instance)
            throw new Error("Missing Instance");
        if (!params.resize_size)
            throw new Error("Missing resize Size");


        var instance = params.instance,
            instanceState = new InstanceState({
                status_raw: "active - resizing",
                status: "active",
                activity: "resizing"
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
                action: "resize",
                resize_size: params.resize_size
            }
        }).done(function() {
            instance.set({
                state: instanceState
            });
        }).fail(function(response) {
            instance.set({
                state: originalState
            });
            Utils.displayError({
                title: "Your instance could not be resized",
                response: response
            });
        }).always(function() {
            Utils.dispatch(InstanceConstants.UPDATE_INSTANCE, {
                instance: instance
            });
            Utils.dispatch(InstanceConstants.POLL_INSTANCE_WITH_DELAY, {
                instance: instance,
                delay: 5*1000
            });
        });
    }
};
