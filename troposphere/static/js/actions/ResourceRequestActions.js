import Utils from "./Utils";
import ResourceConstants from "constants/ResourceRequestConstants";
import errorHandler from "actions/errorHandler"

export default {
    updateRequest(request, status, reason) {
        let params = Object.assign(
            { status: status.id },
            reason === undefined ? {} : { admin_message: reason }
        )

        return Promise.resolve(request.save(params, { patch: true }))
            .then(() => {
                Utils.dispatch(ResourceConstants.UPDATE, {
                    model: request
                });
                Utils.dispatch(ResourceConstants.REMOVE, {
                    model: request
                });
            })
            .catch(errorHandler)
    }
};
