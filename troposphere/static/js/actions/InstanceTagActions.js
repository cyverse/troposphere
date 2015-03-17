define(function (require) {

  var AppDispatcher = require('dispatchers/AppDispatcher'),
      InstanceTagConstants = require('constants/InstanceTagConstants'),
      InstanceTag = require('models/InstanceTag'),
      Utils = require('./Utils'),
      stores = require('stores');

  return {

    add: function(params){
      if(!params.instance) throw new Error("Missing instance");
      if(!params.tag) throw new Error("Missing tag");

      var instance = params.instance,
          tag = params.tag,
          instanceTag = new InstanceTag(),
          data = {
            instance: instance.id,
            tag: tag.id
          };

      instanceTag.save(null, {
        attrs: data
      }).done(function(){
        Utils.dispatch(InstanceTagConstants.ADD_INSTANCE_TAG, {instanceTag: instanceTag});
      }).fail(function(response){
        Utils.displayError({title: "Tag could not be added to Instance", response: response});
      });
    },

    remove: function(params){
      if(!params.instance) throw new Error("Missing instance");
      if(!params.tag) throw new Error("Missing tag");

      var instance = params.instance,
          tag = params.tag,
          instanceTag = stores.InstanceTagStore.getInstanceTagFor(instance, tag);

      instanceTag.destroy().done(function(){
        Utils.dispatch(InstanceTagConstants.REMOVE_INSTANCE_TAG, {instanceTag: instanceTag});
      }).fail(function(response){
        Utils.displayError({title: "Tag could not be removed from Instance", response: response});
      });
    }

  };

});
