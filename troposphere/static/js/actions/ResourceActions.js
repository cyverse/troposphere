import Raven from "raven-js";
import $ from "jquery";
import Utils from "./Utils";
import context from "context";
import globals from "globals";
import ResourceConstants from "constants/ResourceRequestConstants";
import QuotaConstants from "constants/QuotaConstants";
import AccountConstants from "constants/AccountConstants";
import NotificationController from "controllers/NotificationController";

function errorHandler(response) {
    // Note: this error handler supports jQuery style promises. When a jQuery
    // promise is rejected/fails, it calls the error handler with a jqXHR, so
    // here we are anticipating that response is a jqXHR
    let errorDetail;
    if (response.responseJSON) {
        errorDetail = response.responseJSON.detail;
    }

    NotificationController.error(
        "Submission error",
        errorDetail || "Please contact atmosphere support: support@cyverse.org"
    );

    if (Raven.isSetup()) {
        Raven.captureMessage(
            "Resource Request submission failed", { response }
        );
    }

    // This allows other recipients of the promise to see the error
    throw response;
}

export default {
    close(params) {
        let { request, status } = params;

        return Promise.resolve(request.save({ status: status.id }, { patch: true }))
            .then(() => {
                Utils.dispatch(ResourceConstants.UPDATE, {
                    model: request
                });
                Utils.dispatch(ResourceConstants.REMOVE, {
                    model: request
                });
            })
            .catch(errorHandler)
    },

    deny(params) {
        let { request, response, status } = params;

        return Promise.resolve(
                request.save({
                    admin_message: response,
                    status: status.id
                }, {
                    patch: true
                })
            )
            .then(() => {
                Utils.dispatch(ResourceConstants.UPDATE, {
                    model: request
                });
                Utils.dispatch(ResourceConstants.REMOVE, {
                    model: request
                });
            })
            .catch(errorHandler);
    },

    approve(params) {
        let {
            allocationSources, identity, quota, response, request, status
        } = params;

        let promises = [];
        promises.push(
            Promise.all(allocationSources.map(
                as => as.save(as.pick("compute_allowed"), { patch: true })
            ))
        );

        if (quota) {
            var new_quota = (!quota.id) ? true : false;
            promises.push(
               // Skip quota updates (put/patch disabled!)
               Promise.resolve((!quota.id) ? quota.save() : null).then(() => {
                        if(new_quota) {
                            Utils.dispatch( QuotaConstants.CREATE_QUOTA, { quota });
                        }
                        let approval_user = context.profile.get("username");
                        if (window.emulator) {
                            approval_user = window.emulator;
                        }
                        let actionURL = globals.API_V2_ROOT + '/actions/resource_request_update_quota';
                        let data = {
                            'approved_by':approval_user,
                            'identity':identity.get('uuid'),
                            'quota':quota.id,
                            'resource_request':request.id
                        };
                        $.ajax(actionURL, {
                            type: "POST",
                            data: JSON.stringify(data),
                            dataType: "json",
                            contentType: "application/json"
                        });
                    })
                    .then(() => Utils.dispatch( AccountConstants.UPDATE_ACCOUNT))
            );
        }

        return Promise.all(promises)
            .then(
                () => request.save({
                    admin_message: response,
                    status: status.id
                }, {
                    patch: true
                }).then(() => {
                    Utils.dispatch(ResourceConstants.UPDATE, {
                        model: request
                    });
                    Utils.dispatch(ResourceConstants.REMOVE, {
                        model: request
                    })
                })
            ).catch(errorHandler);
    }
};
