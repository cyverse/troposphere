
import AppDispatcher from 'dispatchers/AppDispatcher';
import UserConstants from 'constants/UserConstants';
import User from 'models/User';
import actions from 'actions';
import Utils from './Utils';

export default {
    update: function (user, params) {
      var end_date = params.end_date;

      var newAttributes = {
          end_date: (end_date) ? end_date.format("YYYY-MM-DDThh:mm:ssZ") : null,
      };
      if(params.is_active === false || params.is_active === true) {
          newAttributes.is_active = params.is_active
      }
      if(params.is_staff === false || params.is_staff === true) {
          newAttributes.is_staff = params.is_staff
      }
      if(params.is_superuser === false || params.is_superuser === true) {
          newAttributes.is_superuser = params.is_superuser
      }
      user.set(newAttributes);
      user.save(newAttributes, {patch: true}).done(function () {
        Utils.dispatch(UserConstants.UPDATE_USER, {model: user});
      });
    }
};
