define(function (require) {

  var Utils = require('./Utils'),
    Router = require('../Router'),
    Constants = require('constants/IdentityMemebershipConstants');

  return {
    update: function (params) {
      var membership = params.membership,
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

      membership.set(newAttributes);
      Router.getInstance().transitionTo("resource-membership-manager");
      membership.save(newAttributes, {patch: true}).done(function () {
        Utils.dispatch(Constants.UPDATE, {model: membership});
        Utils.dispatch(Constants.REMOVE, {model: membership});
      });
    }
  };

});
