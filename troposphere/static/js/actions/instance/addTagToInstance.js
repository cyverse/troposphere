define(function (require) {
  "use strict";

  var InstanceConstants = require('constants/InstanceConstants'),
      NotificationController = require('controllers/NotificationController'),
      Utils = require('../Utils');

  return {

    addTagToInstance: function(tag, instance){
      var instanceTags = instance.get('tags');
      instanceTags.push(tag.get('name'));

      instance.set({tags: instanceTags});
      Utils.dispatch(InstanceConstants.UPDATE_INSTANCE, {instance: instance});

      instance.save({
        tags: instanceTags
      }, {
        patch: true
      }).done(function () {
        Utils.dispatch(InstanceConstants.UPDATE_INSTANCE, {instance: instance});
      }).fail(function () {
        NotificationController.error(null, "Error adding tag to Instance");
        Utils.dispatch(InstanceConstants.UPDATE_INSTANCE, {instance: instance});
      });
    }

  };

});
