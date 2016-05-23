
import AppDispatcher from 'dispatchers/AppDispatcher';
import ProfileConstants from 'constants/ProfileConstants';
import NotificationController from 'controllers/NotificationController';
import Utils from './Utils';

export default {

    updateProfileAttributes: function (profile, newAttributes) {
      var that = this;

      profile.set(newAttributes);
      Utils.dispatch(ProfileConstants.UPDATE_PROFILE, {profile: profile});

      profile.save(newAttributes, {patch: true}).done(function () {
        //NotificationController.success(null, "Settings updated.");
        Utils.dispatch(ProfileConstants.UPDATE_PROFILE, {profile: profile});
      }).fail(function () {
        NotificationController.error(null, "Error updating Settings");
        Utils.dispatch(ProfileConstants.UPDATE_PROFILE, {profile: profile});
      });

    }
  }
