define(
  [
    'react',
    'dispatchers/AppDispatcher',
    'constants/ProfileConstants',
    'controllers/NotificationController'
  ],
  function (React, AppDispatcher, ProfileConstants, NotificationController) {

    return {

      dispatch: function (actionType, payload, options) {
        options = options || {};
        AppDispatcher.handleRouteAction({
          actionType: actionType,
          payload: payload,
          options: options
        });
      },

      // ------------------------
      // Standard CRUD Operations
      // ------------------------

      updateProfileAttributes: function (profile, newAttributes) {
        var that = this;

        profile.set(newAttributes);
        that.dispatch(ProfileConstants.UPDATE_PROFILE, {profile: profile});

        profile.save(newAttributes, {patch: true}).done(function () {
          //NotificationController.success(null, "Settings updated.");
          that.dispatch(ProfileConstants.UPDATE_PROFILE, {profile: profile});
        }).fail(function () {
          NotificationController.error(null, "Error updating Settings");
          that.dispatch(ProfileConstants.UPDATE_PROFILE, {profile: profile});
        });

      }
    }

  });
