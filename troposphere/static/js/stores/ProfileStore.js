define(function (require) {

  var _ = require('underscore'),
    Dispatcher = require('dispatchers/Dispatcher'),
    Store = require('stores/Store'),
    Profile = require('models/Profile'),
    NotificationController = require('controllers/NotificationController'),
    ProfileConstants = require('constants/ProfileConstants'),
    globals = require('globals');

  var _profile = null;
  var _isFetching = false;

  //
  // CRUD Operations
  //

  var fetchProfile = function () {
    if (!_isFetching) {
      _isFetching = true;
      var profile = new Profile();
      profile.fetch().then(function () {
        _isFetching = false;
        _profile = profile;
        ProfileStore.emitChange();
      }).fail(function(result){
        if(result.status === 403 || result.status === 500) {
          // Redirect the user to the forbidden page with more info
          var errorText = result.status == 500 ? 'Internal Server Error. Contact support' : result.responseText,
              error_status = encodeURIComponent(errorText);
          window.location = "/forbidden?banner=" + error_status;
        } else {
          NotificationController.error(
            null,
            `There was an error logging you in. If this persists, please email <a href='mailto:${globals.SUPPORT_EMAIL}'>${globals.SUPPORT_EMAIL}</a>.`,
            {
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
    _profile.set(profile, {merge: true});
  }

  //
  // Store
  //

  var ProfileStore = {

    get: function () {
      if (!_profile) {
        fetchProfile();
      }
      return _profile;
    }

  };

  Dispatcher.register(function (payload) {
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

  return ProfileStore;
});
