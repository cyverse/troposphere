define(function (require) {

  var Dispatcher = require('dispatchers/Dispatcher'),
      BaseStore = require('stores/BaseStore'),
      InstanceCollection = require('collections/InstanceCollection'),
      InstanceConstants = require('constants/InstanceConstants');

  var InstanceStore = BaseStore.extend({
    collection: InstanceCollection,

    queryParams: {
      page_size: 100
    },

    initialize: function(){
      this.pollingEnabled = true;
      this.pollingFrequency = 10*1000;
    },

    // ----------------
    // Custom functions
    // ----------------

    getInstancesNotInAProject: function (provider) {
      if(!this.models) return this.fetchModels();

      var instances = this.models.filter(function(instance){
        return instance.get('projects').length === 0
      });

      return new InstanceCollection(instances);
    },

    // -----------------
    // Polling functions
    // -----------------

    isInFinalState: function(instance){
      return instance.get('state').isInFinalState();
    }

  });

  var store = new InstanceStore();

  Dispatcher.register(function (dispatch) {
    var actionType = dispatch.action.actionType;
    var payload = dispatch.action.payload;
    var options = dispatch.action.options || options;

    switch (actionType) {

      case InstanceConstants.ADD_INSTANCE:
        store.add(payload.instance);
        break;

      case InstanceConstants.UPDATE_INSTANCE:
        store.update(payload.instance);
        break;

      case InstanceConstants.REMOVE_INSTANCE:
        store.remove(payload.instance);
        break;

      case InstanceConstants.POLL_INSTANCE:
        store.pollNowUntilBuildIsFinished(payload.instance);
        break;

      default:
        return true;
    }

    if(!options.silent) {
      store.emitChange();
    }

    return true;
  });

  return store;
});
