define(function (require) {

  var Utils = require('./Utils'),
    Router = require('../Router'),
    Constants = require('constants/ImageRequestConstants');

  return {
    update: function (params) {
      var request = params.request,
        action = params.action,
        response = params.response;

      var newAttributes = {
        status: action
      };

      request.set(newAttributes);
      Router.getInstance().transitionTo("admin");
      request.save(newAttributes, {patch: true}).done(function () {
        Utils.dispatch(Constants.UPDATE, {model: request});
        Utils.dispatch(Constants.REMOVE, {model: request});
      });
    }
  };

});
