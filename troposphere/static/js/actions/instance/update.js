define(function (require) {
  "use strict";

  var InstanceConstants = require('constants/InstanceConstants'),
      InstanceState = require('models/InstanceState'),
      NotificationController = require('controllers/NotificationController'),
      Utils = require('../Utils');

  return {
    updateInstanceAttributes: function (instance, newAttributes) {
      instance.set(newAttributes);
      Utils.dispatch(InstanceConstants.UPDATE_INSTANCE, {instance: instance});

      instance.save({
        name: instance.get('name'),
        tags: instance.get('tags')
      }, {
        patch: true
      }).done(function () {
        Utils.dispatch(InstanceConstants.UPDATE_INSTANCE, {instance: instance});
      }).fail(function () {
        var message = "Error updating Instance " + instance.get('name') + ".";
        NotificationController.error(message);
        Utils.dispatch(InstanceConstants.UPDATE_INSTANCE, {instance: instance});
      });
    }
  };

});
