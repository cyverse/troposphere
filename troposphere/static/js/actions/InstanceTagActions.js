define(function (require) {

  var AppDispatcher = require('dispatchers/AppDispatcher'),
      InstanceTagConstants = require('constants/InstanceTagConstants'),
      InstanceTag = require('models/InstanceTag'),
      Utils = require('./Utils'),
      stores = require('stores');

  return {

    // ----------------------------
    // Add/Remove Project Resources
    // ----------------------------

    addTagToInstance: function(tag, instance, options){
      var instanceTag = new InstanceTag(),
          data = {
            instance: instance.id,
            tag: tag.id
          };

      instanceTag.save(null, { attrs: data }).done(function(){
        Utils.dispatch(InstanceTagConstants.ADD_PROJECT_INSTANCE, {instanceTag: instanceTag}, options);
      });
    },

    removeTagFromInstance: function(tag, instance, options){
      var instanceTag = stores.InstanceTagStore.getInstanceTagFor(instance, tag);

      instanceTag.destroy().done(function(){
        Utils.dispatch(InstanceTagConstants.REMOVE_PROJECT_INSTANCE, {instanceTag: instanceTag}, options);
      });
    }

  };

});
