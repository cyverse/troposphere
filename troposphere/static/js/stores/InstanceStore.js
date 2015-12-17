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

    initialize: function () {
      this.pollingEnabled = true;
      this.pollingFrequency = 10 * 1000;
    },

    // ----------------
    // Custom functions
    // ----------------

    getInstancesNotInAProject: function (provider) {
      if (!this.models) return this.fetchModels();

      var instances = this.models.filter(function (instance) {
        return instance.get('projects').length === 0
      });

      return new InstanceCollection(instances);
    },

    // -----------------
    // Polling functions
    // -----------------

    isInFinalState: function(instance) {
        if (instance.get('state').get('status') == 'active' && instance.get('ip_address').charAt(0) == '0') {
            return false;
        }

        return instance.get('state').isInFinalState();
    },

    // Poll for a model, if and while keepPolling(model) returns true
    pollUntilDeleted: function(model)  {
      if (!model.fetchFromCloud)
          throw new Error("model missing required method for polling: fetchFromCloud");

      var args = arguments;

      model.fetchFromCloud(function(response) {
          // Check to see if instance was removed
          if (response.status == "404") {
              this.remove(model);
              this.emitChange();
              return;
          }
          this.update(model);
          this.emitChange();

          // Poll again (call pollUntilDeleted with the same arguments)
          setTimeout(this.pollUntilDeleted.bind(this, ...args), this.pollingFrequency);
      }.bind(this));
    },

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
        // This happens whether or not polling is enabled in basestore (seems unintuitive)
        store.pollNowUntilBuildIsFinished(payload.instance);
        break;

      case InstanceConstants.POLL_FOR_DELETED:
        store.pollUntilDeleted(payload.instance);
        break;

      default:
        return true;
    }

    if (!options.silent) {
      store.emitChange();
    }

    return true;
  });

  return store;
});
