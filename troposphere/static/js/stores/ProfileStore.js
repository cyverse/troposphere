define(
  [
    'underscore',
    'dispatchers/Dispatcher',
    'stores/Store',
    'models/Profile',
    'controllers/NotificationController',
    'constants/ProfileConstants',
    'actions'
  ],
  function (_, Dispatcher, Store, Profile, NotificationController, ProfileConstants, actions) {

    var _profile = null;
    var _isFetching = false;

    //
    // CRUD Operations
    //

    var fetchProfile = function () {
      if(!_isFetching) {
        _isFetching = true;
        var profile = new Profile();
        profile.fetch().then(function () {
          _isFetching = false;
          _profile = profile;
          ProfileStore.emitChange();
        }).fail(function(result){
          if(result.status === 403) {
            // Redirect the user to the forbidden page with more info
            window.location.pathname = "/forbidden";
          }else if(result.status === 503){
            actions.ServiceUnavailableActions.showMaintenanceModal();
          }else {
            NotificationController.error(
              null,
              "There was an error logging you in. If this persists, please email <a href='mailto:support@iplantcollaborative.org'>support@iplantcollaborative.org</a>.",
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

    function update(profile){
      _profile.set(profile, {merge: true});
    }

    //
    // Store
    //

    var ProfileStore = {

      get: function () {
        if(!_profile) {
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
