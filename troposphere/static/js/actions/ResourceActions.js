import Utils from "./Utils";
import ResourceConstants from "constants/ResourceRequestConstants";
import QuotaConstants from "constants/QuotaConstants";
import AllocationConstants from "constants/AllocationConstants";
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

        return Promise.resolve(request.save({
            status: status.id
        }, {
            patch: true
        }).promise())
            .then(() => {
                Utils.dispatch(ResourceConstants.UPDATE, {
                    model: request
                })
            })
            .catch(errorHandler);
    },

    deny(params) {
        let { request, response, status } = params;

        return Promise.resolve(
            request.save({
                admin_message: response,
                status: status.id
            }, {
                patch: true
            }).promise())
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
        let { request, response, quota, allocation, status } = params;

        let promises = [];
        if (quota.isNew()) {
            promises.push(quota.save().then(
                () => Utils.dispatch(
                    QuotaConstants.CREATE_QUOTA,
                    {
                        quota: quota
                    },
                    {
                        silent: false
                    }
                )
            ));
        }

        if (allocation.isNew()) {
            promises.push(allocation.save().then(
                () => Utils.dispatch(
                    AllocationConstants.CREATE_ALLOCATION,
                    {
                        allocation: allocation
                    },
                    {
                        silent: false
                    }
                )
            ))
        }

        return Promise.all(promises)
            .then(
                () => request.save({
                    admin_message: response,
                    quota: quota.id,
                    allocation: allocation.id,
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
        )
            .catch(errorHandler);
    }
};
