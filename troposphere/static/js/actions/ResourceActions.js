
import Utils from './Utils';
import Router from '../Router';
import Constants from 'constants/ResourceRequestConstants';

export default {
    update: function (params) {
      var request = params.request,
        response = params.response,
        quota = params.quota,
        allocation = params.allocation,
        status = params.status;

      var newAttributes = {
        admin_message: response,
        quota: quota,
        allocation: allocation,
        status: status
      };

      request.set(newAttributes);
      Router.getInstance().transitionTo("resource-request-manager");
      request.save(newAttributes, {patch: true}).done(function () {
        Utils.dispatch(Constants.UPDATE, {model: request});
        Utils.dispatch(Constants.REMOVE, {model: request});
      });
    }
};
