import _ from "underscore";
import Dispatcher from "dispatchers/Dispatcher";
import Store from "stores/Store";
import ClientCredential from "models/ClientCredential";

import NotificationController from "controllers/NotificationController";

/**
 * Author note: (@lenards)
 *
 * This is a mimic of `models/Profile` & `stores/ProfileStore`.
 *
 * Why? Because the functionality of exporting the credentials associated
 * with an "Identity" (aka AtmosphereUser + Provider) did not appear to
 * match the examples of :store -> :collection -> :model that commonly
 * exists within the application.
 *
 * Here we introduce a "jargon-y" term, Client Credential as a manner of
 * capturing what this _thing_ is that we're trying to acquire/export/
 * grab. It is likely not going to be understood by community members,
 * but has been selected to indicate that this "credential" has *value*
 * when used with :cloud: client tools and command-line interfaces.
 *
 * Please approach the below code with any amount of healthy sketicism
 * you can offer - you will likely be rewarded for it
 */

let _isFetching = false;

/**
 * Cache credentials, like a singleton of sorts, by `identity_uuid`
 */
let _creds = {};

let fetchCredential = function(identityId) {
    if (!_isFetching) {
        // the Backbone.Model will need an `identity_uuid` when
        // fetching the associated information, so pass it on
        // initialize.
        let cred = new ClientCredential({
            "identity_uuid": identityId
        });

        _isFetching = true;

        cred.fetch().then(function() {
            _isFetching = false;
            _creds[identityId] = cred;
            ClientCredentialStore.emitChange();
        }).fail(function(result) {
            let errorMsg = `There was an error exporting credentials. ${result.responseText}`;

            NotificationController.error(
                null,
                errorMsg,
                {
                    "positionClass": "toast-top-full-width",
                    "timeOut": "0",
                    "extendedTimeOut": "0"
                }
            );
        });
    }
}


//
// Define Store
//
let ClientCredentialStore = {
    getForIdentity: function(identityId) {
        if (!_creds[identityId]) {
            fetchCredential(identityId);
        }
        return _creds[identityId];
    }
};


Dispatcher.register(function(payload) {
    var action = payload.action;

    switch (action.actionType) {
// TODO
// - eventually a "reset" of credentials will be needed
//   this will require the `identity-uuid` to reset;
//   other details will be forthcoming
//
//        case ClientCredentialConstants.RESET_CREDENTIAL:
//            update(action.name, action.identity);
//            break;

        default:
            // do nothing; for now
            break;
    }

    ClientCredentialStore.emitChange();

    return true;
});


_.extend(ClientCredentialStore, Store);

export default ClientCredentialStore;
