import Utils from "./Utils";
import ResourceConstants from "constants/ResourceRequestConstants";
import QuotaConstants from "constants/QuotaConstants";
import IdentityConstants from "constants/AccountConstants";
import NotificationController from "controllers/NotificationController";

function errorHandler(response) {
    let title = "Submission contained errors"
    let message = "Please contact atmosphere support: support@cyverse.org";

    // Try to provide a better error message
    if (response.status == 405 && response.responseJSON) {
        message = response.responseJSON.detail || message;
    }

    NotificationController.error(
        message,
        title
    );

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
            promises.push(
                quota.save()
                    .then(() => {
                        Utils.dispatch( QuotaConstants.CREATE_QUOTA, { quota });
                        return identity.set("quota", quota.toJSON())
                                       .save({ quota: { id: quota.id } }, { patch: true });
                    })
                    .then(() => Utils.dispatch( IdentityConstants.UPDATE_ACCOUNT))
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
