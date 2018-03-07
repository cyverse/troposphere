import _ from "underscore";

import Dispatcher from "dispatchers/Dispatcher";
import Store from "stores/Store";

import NotificationController from "controllers/NotificationController";
import UserPreferenceCollection from "collections/UserPreferenceCollection";
import UserPreferenceConstants from "constants/UserPreferenceConstants";


let _userPref = null;
let _isFetching = false;


function _handelFetchFailure(result) {
        if (result.status === 403 ||
            result.status === 500) {
                // Redirect the user to the forbidden page with more info
                var errorText = result.status == 500
                              ? "Internal Server Error. Contact support"
                              : result.responseText;

                window.location = "/forbidden?banner=" + encodeURIComponent(errorText);

        } else {
            NotificationController.error(
                null,
                "There was an error trying to fetch preferences");
        }
}

function fetchUserPref() {
    if (!_isFetching) {
        // signal store is retrieving data
        _isFetching = true;

        let models = new UserPreferenceCollection();

        models.fetch({
            url: _.result(models, "url") // add queryString parameters, if needed
        }).done(function() {
            _isFetching = false;
            _userPref = models.at(0);
            UserPreferenceStore.emitChange();
        }).fail(function(result) {
            _handelFetchFailure(result);
        });
    }
}

function updateUserPref(payload) {
    let { model } = payload;

    if (model) {
        _userPref.set(model, { merge: true });
    }
}

/**
 * Define Store for UserPreference model
 */
const UserPreferenceStore = {
    get() {
        if (!_userPref) {
            fetchUserPref();
        }
        return _userPref;
    }
};

Dispatcher.register(function(msg) {
    let action = msg.action,
        { payload } = action;

    switch (action.actionType) {
        case UserPreferenceConstants.UPDATE_USER_PREFERENCE:
            if (payload) {
                updateUserPref(payload)
            }
            break;

        default:
            return true;
    }

    UserPreferenceStore.emitChange();

    return true;
});

_.extend(UserPreferenceStore, Store);


export default UserPreferenceStore;
