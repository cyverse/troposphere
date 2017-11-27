import Utils from "./Utils";
import ResourceConstants from "constants/ResourceRequestConstants";

export default {
    updateRequest(request, status, reason) {
        let params = Object.assign(
            { status: { id: status.id } },
            reason === undefined ? {} : { admin_message: reason }
        )

        let promise = Promise.resolve(request.save(params, { patch: true }));
        promise
            .then(() => {
                Utils.dispatch(ResourceConstants.UPDATE, {
                    model: request
                });
                Utils.dispatch(ResourceConstants.REMOVE, {
                    model: request
                });
            });
        return promise;
    }
};
