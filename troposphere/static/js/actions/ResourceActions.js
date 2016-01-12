define(function (require) {

  var Utils = require('./Utils'),
    Router = require('../Router'),
    Constants = require('constants/ResourceRequestConstants');

  return {
    close: function(params){
      var request = params.request;
      var newAttributes = {
        status: params.status
      };

      request.set(newAttributes);
      request.save(newAttributes, {patch: true}).done(function(){
        Utils.dispatch(Constants.UPDATE, {model: request});
      });
    },

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

});
