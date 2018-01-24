import Utils from "./Utils";
import AdminResourceConstants from "constants/AdminResourceRequestConstants";

export default {
    updateRequest(request, status, reason) {
        let params = Object.assign(
            { status: { id: status.id } },
            reason === undefined ? {} : { admin_message: reason }
        )

        let promise = Promise.resolve(request.save(params, { patch: true }));
        promise
            .then(() => {
                Utils.dispatch(AdminResourceConstants.UPDATE, {
                    model: request
                });
            });
        return promise;
    }
};
