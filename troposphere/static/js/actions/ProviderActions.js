import Utils from "./Utils";
import NotificationController from "controllers/NotificationController";

// Constants
import ProviderConstants from "constants/ProviderConstants";

// Models
import Provider from "models/Provider";

// If a modal was used, then uncomment the import below
// Modals
//import ModalHelpers from "components/modals/ModalHelpers";


export default {

    // ------------------------
    // Standard CRUD Operations
    // ------------------------

    create: function(params, onSuccess, onFailure) {
        var provider = new Provider(params)


        Utils.dispatch(ProviderConstants.ADD_PROVIDER, {
            provider: provider
        });

        provider.save().done(function() {
            // NotificationController.success(null, "Provider " + provider.get('name') + " created.");
            Utils.dispatch(ProviderConstants.UPDATE_PROVIDER, {
                provider: provider
            });
            if (onSuccess != null) {
                onSuccess(provider);
            }

        }).fail(function(response) {
            var err_response = response.responseJSON || response.responseText;
            var message = "Error creating Provider " + provider.get("name") + ":" + err_response;
            NotificationController.error(null, message);
            Utils.dispatch(ProviderConstants.REMOVE_PROVIDER, {
                provider: provider
            });
            if (onFailure != null) {
                onFailure(provider);
            }
        });
    }
};
