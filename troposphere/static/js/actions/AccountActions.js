import Utils from "./Utils";
import NotificationController from "controllers/NotificationController";
import Router from "../Router";
import actions from "actions";

// Constants
import AccountConstants from "constants/AccountConstants";

// Models
import Account from "models/Account";

// Modals
import ModalHelpers from "components/modals/ModalHelpers";


export default {

    // ------------------------
    // Standard CRUD Operations
    // ------------------------

    create: function(params, onSuccess, onFailure) {
        var account = new Account(params)


        Utils.dispatch(AccountConstants.ADD_ACCOUNT, {
            account: account
        });

        account.save().done(function() {
            //NotificationController.success(null, "Account " + account.get('name') + " created.");
            //FIXME: need to 'trigger' an IdentityStore - clear_cache and reload
            Utils.dispatch(AccountConstants.UPDATE_ACCOUNT, {
                account: account
            });
            if (onSuccess != null) {
                onSuccess(account);
            }

        }).fail(function() {
            var message = "Error creating Account " + account.get("name") + ".";
            NotificationController.error(null, message);
            Utils.dispatch(AccountConstants.REMOVE_ACCOUNT, {
                account: account
            });
            if (onFailure != null) {
                onFailure(account);
            }
        });
    }
};
