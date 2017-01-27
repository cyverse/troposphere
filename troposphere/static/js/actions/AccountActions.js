import Utils from "./Utils";
// Constants
import AccountConstants from "constants/AccountConstants";

// Models
import Account from "models/Account";

// If a modal was used, then uncomment the import below
// Modals
//import ModalHelpers from "components/modals/ModalHelpers";


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
            //FIXME: need to 'trigger' an IdentityStore - clear_cache and reload
            Utils.dispatch(AccountConstants.UPDATE_ACCOUNT, {
                account: account
            });
            if (onSuccess != null) {
                onSuccess(account);
            }

        }).fail(function(response) {
            Utils.displayError({
                response: response,
                title: "Account Update Error"
            });
            Utils.dispatch(AccountConstants.REMOVE_ACCOUNT, {
                account: account
            });
            if (onFailure != null) {
                onFailure(account);
            }
        });
    }
};
