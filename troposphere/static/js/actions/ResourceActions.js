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
    let json = response.responseJSON;
    if (json && json.detail) {
        // Returned by drf validaion exceptions
        errorDetail = json.detail;
    } else if (json && json.errors) {
        // Returned by atmosphere api exceptions
        errorDetail = json.errors[0].message;
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

        // Truthy quota means the user's quota changed, have to handle new
        // quota or existing quota
        if (quota) {
            promises.push(

                // We only create (save) the quota if it didn't exist before
                Promise.resolve(
                        quota.isNew() &&
                        quota.save()
                             .then(Utils.dispatch(QuotaConstants.CREATE_QUOTA, { quota }))
                    )

                    // Submit an action to associate the quota with the request
                    .then(() => {
                        let username = context.profile.get("username");
                        let actionURL = globals.API_V2_ROOT + '/actions/resource_request_update_quota';
                        let data = {
                            'approved_by': username,
                            'identity':identity.get('uuid'),
                            'quota':quota.id,
                            'resource_request':request.id
                        };
                        return $.ajax(actionURL, {
                            type: "POST",
                            data: JSON.stringify(data),
                            dataType: "json",
                            contentType: "application/json"
                        })
                    })

                    // Clear the cache, so that future requests to this
                    // identity will see the new quota
                    .then(() => Utils.dispatch(AccountConstants.UPDATE_ACCOUNT))
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
