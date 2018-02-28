import UserPreferenceConstants from "constants/UserPreferenceConstants";
import NotificationController from "controllers/NotificationController";
import Utils from "./Utils";

export default {

    updateUserPreferenceAttributes: function(model, newAttributes) {
        model.set(newAttributes);

        model.save(newAttributes, {
            patch: true
        }).done(function() {
            Utils.dispatch(UserPreferenceConstants.UPDATE_USER_PREFERENCE, {
                model
            });
        }).fail(function() {
            NotificationController.error(null, "Updating preference failed");
            Utils.dispatch(UserPreferenceConstants.UPDATE_USER_PREFERENCE, {
                model
            });
        });

    }
}
