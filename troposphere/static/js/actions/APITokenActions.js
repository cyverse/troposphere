import APITokenConstants from "constants/APITokenConstants";
import APIToken from "models/APIToken";
import NotificationController from "controllers/NotificationController";
import Utils from "./Utils";

export default {
    create: (name, userId) => {
        if (!name) throw new Error("Missing Token name");
        if (!userId) throw new Error("Missing Token author");
        let apiToken = new APIToken({
            name,
            atmo_user: userId
        });

        let promise = Promise.resolve(apiToken.save());
        promise.then(() => {
            Utils.dispatch(APITokenConstants.ADD_TOKEN, {apiToken});
        });
        promise.catch(() => {
            NotificationController.error(
                "Error creating token.",
                "Your login might be expired. If you continue to see this error " +
                    "after logging in again, contact support."
            );
        });
        return promise;
    },
    update: (apiToken, newAttributes) => {
        let prevAttributes = Object.assign({}, apiToken.attributes);

        apiToken.set(newAttributes);
        Utils.dispatch(APITokenConstants.UPDATE_TOKEN, {apiToken});
        apiToken
            .save(newAttributes, {patch: true})
            .done(() => {
                Utils.dispatch(APITokenConstants.UPDATE_TOKEN, {apiToken});
            })
            .fail(response => {
                Utils.displayError({
                    title: "Token could not be saved",
                    response
                });
                apiToken.set(prevAttributes);
                Utils.dispatch(APITokenConstants.UPDATE_TOKEN, {apiToken});
            });
        return apiToken;
    },
    destroy: apiToken => {
        // Destroy token optimistically
        Utils.dispatch(APITokenConstants.REMOVE_TOKEN, {apiToken});

        apiToken
            .destroy()
            .done(() => {
                Utils.dispatch(APITokenConstants.REMOVE_TOKEN, {apiToken});
            })
            .fail(() => {
                Utils.dispatch(APITokenConstants.UPDATE_TOKEN, {apiToken});
                NotificationController.error(
                    "Error deleting token.",
                    "Your login might be expired. If you continue to see this error " +
                        "after logging in again, contact support."
                );
            });
        return apiToken;
    }
};
