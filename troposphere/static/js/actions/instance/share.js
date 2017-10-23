
import Utils from "../Utils";
import InstanceAccess from "models/InstanceAccess";
import InstanceAccessConstants from "constants/InstanceAccessConstants";

export default {

    deleteShareRequest: function(params) {
        // Delete access request
        if (!params.instance_access_request)
            throw new Error("Missing instance_access_request");
        let { instance_access_request } = params;

        instance_access_request.destroy({
        }).done(function() {
                Utils.dispatch(InstanceAccessConstants.REMOVE_INSTANCE_ACCESS, {
                    instance_access_request,
                });
                Utils.displaySuccess({
                    message: `Your instance access request has been deleted.`
                });
        }).fail(function() {
                Utils.displayError({
                    message: `Failed to delete instance access request.`
                });
        });
    },
    createShareRequest: function(params) {
        if (!params.instance)
            throw new Error("Missing instance");
        if (!params.user)
            throw new Error("Missing user");

        let { instance, user } = params,
            username = user.get('username'),
            newAccessRequest = new InstanceAccess({
                instance,
                user}),
            payload = {
                instance: instance.get('uuid'),
                user: user.get('username'),
            };

        // Add request to Store
        Utils.dispatch(InstanceAccessConstants.ADD_INSTANCE_ACCESS, {
            instance_access_request: newAccessRequest
        });
        //TODO: This call does not surface a new Instance Access Request in the InstanceDetails view after creation.
        //TODO: This call only surfaces 'pending' status, but does not show the instance or user to be set on Settings page.
        newAccessRequest.create(payload).done(function(attrs, status, response) {
                newAccessRequest.set("id", attrs.id);
                newAccessRequest.set("status", attrs.status);
                Utils.dispatch(InstanceAccessConstants.UPDATE_INSTANCE_ACCESS, {
                    instance_access_request: newAccessRequest
                });
                Utils.displaySuccess({
                    message: `Your instance access request has been sent to ${username}.`
                });
            }).fail(function() {
                Utils.dispatch(InstanceAccessConstants.REMOVE_INSTANCE_ACCESS, {
                    instance_access_request: newAccessRequest
                });
                Utils.displayError({
                    message: `Failed to create instance access request.`
                });
            });
    },
    updateShareRequest: function(params) {
        if (!params.instance_access_request)
            throw new Error("Missing access_request");
        if (!params.status)
            throw new Error("Missing status");

        let { status, instance_access_request } = params,
            newAttributes = {status},
            oldStatus = instance_access_request.get('status');

        instance_access_request.set(newAttributes);
        Utils.dispatch(InstanceAccessConstants.UPDATE_INSTANCE_ACCESS, { instance_access_request });

        instance_access_request.save(newAttributes, {patch: true})
            .done(function() {
                Utils.displaySuccess({
                    message: `Instance access request has been ${status}.`
                })
            })
            .fail(response => {
                Utils.displayError({
                    title: "Instance access request could not be saved",
                    response: response
                });
                instance_access_request.set({status: oldStatus});
                Utils.dispatch(InstanceAccessConstants.UPDATE_INSTANCE_ACCESS, { instance_access_request });
            });
        // update access request
    },

};
