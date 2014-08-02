define(
  [
    'underscore',
    'dispatchers/Dispatcher',
    'stores/Store',
    'models/Profile',
    'controllers/NotificationController'
  ],
  function (_, Dispatcher, Store, Profile, NotificationController) {

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
        }).fail(function(){
          NotificationController.error(
            null,
            "There was an error logging you in. If this persists, please email <a href='mailto:support@iplantcollaborative.org'>support@iplantcollaborative.org</a>.",
            {
              "positionClass": "toast-top-full-width"
            }
          );
        });
      }
    };

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

      // switch (action.actionType) {
      //    case ProfileConstants.PROFILE_UPDATE:
      //      update(action.name, action.description);
      //      break;

      //    default:
      //      return true;
      // }

      // ProfileStore.emitChange();

      return true;
    });

    _.extend(ProfileStore, Store);

    return ProfileStore;
  });
