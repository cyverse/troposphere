import APITokenConstants from "constants/APITokenConstants";
import APIToken from "models/APIToken";
import Utils from "./Utils";

export default {
    create: name => {
        if (!name) throw new Error("Missing Token name");
        let apiToken = new APIToken({
            name
        });

        let promise = Promise.resolve(apiToken.save());
        promise.then(() =>
            Utils.dispatch(APITokenConstants.ADD_TOKEN, {apiToken})
        );
        promise.catch(response =>
            Utils.displayError({title: "Error creating token", response})
        );
        return promise;
    },
    update: (apiToken, newAttributes) => {
        let prevAttributes = Object.assign({}, apiToken.attributes);
        apiToken.set(newAttributes);
        // Update token optimistically
        Utils.dispatch(APITokenConstants.UPDATE_TOKEN, {apiToken});
        let promise = Promise.resolve(
            apiToken.save(newAttributes, {patch: true})
        );
        promise.then(() =>
            Utils.dispatch(APITokenConstants.UPDATE_TOKEN, {apiToken})
        );
        promise.catch(response => {
            Utils.displayError({
                title: "Token could not be saved",
                response
            });
            apiToken.set(prevAttributes);
            Utils.dispatch(APITokenConstants.UPDATE_TOKEN, {apiToken});
        });
        return promise;
    },
    destroy: apiToken => {
        // Destroy token optimistically
        Utils.dispatch(APITokenConstants.REMOVE_TOKEN, {apiToken});
        let promise = Promise.resolve(apiToken.destroy());
        promise.then(() =>
            Utils.dispatch(APITokenConstants.REMOVE_TOKEN, {apiToken})
        );
        promise.catch(response => {
            Utils.dispatch(APITokenConstants.ADD_TOKEN, {apiToken});
            Utils.displayError({
                title: "Error deleting token",
                response
            });
        });
        return promise;
    }
};
