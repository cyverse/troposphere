define(function (require) {

  var Utils = require('./Utils'),
    Router = require('../Router'),
    stores = require('stores'),
    Constants = require('constants/ImageRequestConstants');

  return {
    update: function (params) {
      var request = params.request,
        status = params.status,
        response = params.response;

      var newAttributes = {
        admin_message: response,
        // we need to send these in to get around our MachineRequestSerializer API validation
        instance: request.get('instance').id,
        new_machine_owner: request.get('new_machine_owner').id,
        new_machine_provider: request.get('new_machine_provider').id,
        status: status
      };

      request.set(newAttributes);
      Router.getInstance().transitionTo("image-request-manager");
      request.save(newAttributes, {patch: true}).done(function () {
        Utils.dispatch(Constants.UPDATE, {model: request});
        Utils.dispatch(Constants.REMOVE, {model: request});
      });
    }
  };

});
