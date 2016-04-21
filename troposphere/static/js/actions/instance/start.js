define(function (require) {
  "use strict";

  var InstanceConstants = require('constants/InstanceConstants'),
    InstanceState = require('models/InstanceState'),
    Utils = require('../Utils'),
    InstanceActionRequest = require('models/InstanceActionRequest');

  return {

    start: function (params) {
      if (!params.instance) throw new Error("Missing instance");

      var instance = params.instance,
        instanceState = new InstanceState({status_raw: "shutoff - powering-on", status: "shutoff", activity: "powering-on"}),
        originalState = instance.get('state'),
        actionRequest = new InstanceActionRequest({instance: instance});

      instance.set({state: instanceState});
      Utils.dispatch(InstanceConstants.UPDATE_INSTANCE, {instance: instance});

      actionRequest.save(null, {
        attrs: {action: "start"}
      }).done(function () {
        instance.set({
          state: instanceState
        });
      }).fail(function (response) {
        instance.set({state: originalState});
        Utils.displayError({title: "Your instance could not be started", response: response});
      }).always(function () {
        Utils.dispatch(InstanceConstants.UPDATE_INSTANCE, {instance: instance});
        Utils.dispatch(InstanceConstants.POLL_INSTANCE, {instance: instance});
      });
    }

  };

});
