define(function (require) {
  "use strict";

  var InstanceConstants = require('constants/InstanceConstants'),
      Utils = require('../Utils');

  return {

    update: function (instance, newAttributes) {
      if(!instance) throw new Error("Missing instance");
      if(!newAttributes || !newAttributes.name) throw new Error("Missing attributes.name");

      instance.set(newAttributes);

      Utils.dispatch(InstanceConstants.UPDATE_INSTANCE, {instance: instance});

      instance.save({
        name: instance.get('name')
      }, {
        patch: true
      }).done(function() {
        // Nothing to do here
      }).fail(function(response) {
        Utils.displayError({title: "Instance could not be updated", response: response});
      }).always(function() {
        Utils.dispatch(InstanceConstants.UPDATE_INSTANCE, {instance: instance});
        Utils.dispatch(InstanceConstants.POLL_INSTANCE, {instance: instance});
      });
    }

  };

});
