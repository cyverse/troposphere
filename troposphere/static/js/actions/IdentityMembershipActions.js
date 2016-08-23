import Utils from './Utils';
import Router from '../Router';
import Constants from 'constants/IdentityMembershipConstants';

export default {
    update: function (membership, params) {
      var end_date = params.end_date;

      var newAttributes = {
          end_date: (end_date) ? end_date.format("YYYY-MM-DDThh:mm:ssZ") : null,
      };

      membership.set(newAttributes);
      membership.save(newAttributes, {patch: true}).done(function () {
        Utils.dispatch(Constants.UPDATE, {model: membership});
      });
    }
};
