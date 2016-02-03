define(function (require) {
  "use strict";

  var InstanceConstants = require('constants/InstanceConstants'),
    InstanceState = require('models/InstanceState'),
    stores = require('stores'),
    Utils = require('../Utils'),
    ProjectInstanceConstants = require('constants/ProjectInstanceConstants'),
    globals = require('globals');

  return {

    destroy: function (payload, options) {
      if (!payload.project) throw new Error("Missing project");
      if (!payload.instance) throw new Error("Missing instance");

      var instance = payload.instance,
        project = payload.project,
        originalState = instance.get('state'),
        instanceState = new InstanceState({status_raw: originalState.get("status") + " - deleting"}),
        identity = instance.get('identity'),
        provider = instance.get('provider'),
        url = (
          globals.API_ROOT +
          "/provider/" + provider.uuid +
          "/identity/" + identity.uuid +
          "/instance/" + instance.get('uuid')
        );

      instance.set({state: instanceState});
      Utils.dispatch(InstanceConstants.UPDATE_INSTANCE, {instance: instance});

      instance.destroy({
        url: url
      }).done(function () {
        Utils.dispatch(InstanceConstants.POLL_FOR_DELETED, {instance: instance});
      }).fail(function (response) {
        instance.set({state: originalState});
        Utils.dispatch(InstanceConstants.UPDATE_INSTANCE, {instance: instance});
        Utils.dispatch(InstanceConstants.POLL_INSTANCE, {instance: instance});
        Utils.displayError({title: "Your instance could not be deleted", response: response});
      });
    }

  };

});
