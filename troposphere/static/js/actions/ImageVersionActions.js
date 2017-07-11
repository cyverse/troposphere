import Utils from "./Utils";
import NotificationController from "controllers/NotificationController";

// Constants
import ImageVersionConstants from "constants/ImageVersionConstants";

export default {

    update: function(version, newAttributes) {
        if (!version)
            throw new Error("Missing Image Version");
        if (!newAttributes)
            throw new Error("No attributes to be updated");

        version.set(newAttributes);
        version.save(newAttributes, {
            patch: true
        }).done(function() {
            // UPDATE_VERSION here if we do NOT want 'optimistic updating'
            // Othewise, do nothing..
        }).fail(function(err_resp) {
            var error_json = err_resp.responseJSON;
            let err_message = error_json;
            if (error_json.hasOwnProperty("non_field_errors")) {
                err_message = error_json.non_field_errors.join(" , ");
                if(err_message.name  != null && err_message.name[0] != null) {
                    err_message = err_message.name[0]
                }
            }
            var message = "Error updating Image Version '" + version.get("name") + "': " + err_message;
            NotificationController.error(null, message);
            Utils.dispatch(ImageVersionConstants.REMOVE_IMAGE_VERSION, {
                version: version
            });
        }).always(function() {
            // todo: add a POLL_IMAGE_VERSION constant if you want this to work (also need
            // to add a handler in the ImageVersionStore)
            //Utils.dispatch(ImageVersionConstants.POLL_IMAGE_VERSION, {version: version});
        });
    }


}
