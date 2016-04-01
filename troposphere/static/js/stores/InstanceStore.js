define(function (require) {

  var Dispatcher = require('dispatchers/Dispatcher'),
    BaseStore = require('stores/BaseStore'),
    InstanceCollection = require('collections/InstanceCollection'),
    _ = require('underscore'),
    actions = require('actions'),
    Utils = require('actions/Utils'),
    InstanceConstants = require('constants/InstanceConstants'),
    InstanceState = require('models/InstanceState');

  var InstanceStore = BaseStore.extend({
    collection: InstanceCollection,

    queryParams: {
      page_size: 100
    },

    initialize: function () {
      this.pollingEnabled = false;
      //this.pollingFrequency = 10 * 1000;
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

    getTotalResources: function (providerId) {
        if (!this.models) return this.fetchModels();

        let total = {
            cpu: 0,
            mem: 0,
            disk: 0
        };

        this.models.forEach(function(item) {
            if (providerId == item.get('identity').provider) {
                total.cpu = total.cpu += item.get('size').cpu;
                total.mem = total.mem += item.get('size').mem;
                total.disk = total.disk += item.get('size').disk;
            }
        });
        return total;
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

    // Poll for a model
    pollUntilDeleted: function(instance) {
        this.pollWhile(instance, function(model, response) {
            // If 404 then remove the model
            if (response.status == "404") {
                this.remove(model);

                return false;
            }

            var status = instance.get('state').get("status");
            instance.set({
                state: new InstanceState({
                    status_raw: status + " - deleting"
                }),
            });

            Utils.dispatch(InstanceConstants.UPDATE_INSTANCE, {instance: instance});

            // Keep polling while 200 or not 404 
            return response.status == "200";

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

      case InstanceConstants.PUSH_INSTANCE:
        // Make this call when you have finished
        // Creating a new instance so that you can
        // be added to the update list
        // across the stores.
        actions.InstanceActions.initiatePush()
        break;

      case InstanceConstants.PUSH_UPDATE_INSTANCE:
        // Make this call when you have finished
        // 'Modeling' a payload.instance to be updated
        // across the stores.
        store.update(payload.instance);
        break;

      case InstanceConstants.POLL_INSTANCE:
        break;

      case InstanceConstants.POLL_FOR_DELETED:
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
