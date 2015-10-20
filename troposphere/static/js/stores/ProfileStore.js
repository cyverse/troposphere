
import _ from 'underscore';
import Dispatcher from 'dispatchers/Dispatcher';
import Store from 'stores/Store';
import Profile from 'models/Profile';
import NotificationController from 'controllers/NotificationController';
import ProfileConstants from 'constants/ProfileConstants';

let _profile = null;
let _isFetching = false;

//
// CRUD Operations
//
let fetchProfile = function() {
    if (!_isFetching) {
        _isFetching = true;
        var profile = new Profile();
        profile.fetch().then(function() {
            _isFetching = false;
            _profile = profile;
            ProfileStore.emitChange();
        }).fail(function(result) {
            if (result.status === 403 || result.status === 500) {
                // Redirect the user to the forbidden page with more info
                window.location.pathname = "/forbidden";
            } else {
                NotificationController.error(
                    null,
                    "There was an error logging you in. If this persists, please email <a href='mailto:support@iplantcollaborative.org'>support@iplantcollaborative.org</a>.", {
                        "positionClass": "toast-top-full-width",
                        "timeOut": "0",
                        "extendedTimeOut": "0"
                    }
                );
            }
        });
    }
};

function update(profile) {
    _profile.set(profile, {
        merge: true
    });
}

//
// Store
//
let ProfileStore = {

    get: function() {
        if (!_profile) {
            fetchProfile();
        }
        return _profile;
    }

};

Dispatcher.register(function(payload) {
    var action = payload.action;

    switch (action.actionType) {
        case ProfileConstants.UPDATE_PROFILE:
            update(action.name, action.description);
            break;

        default:
            return true;
    }

    ProfileStore.emitChange();

    return true;
});

_.extend(ProfileStore, Store);

export default ProfileStore;
