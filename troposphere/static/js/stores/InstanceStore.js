import Dispatcher from 'dispatchers/Dispatcher';
import BaseStore from 'stores/BaseStore';
import InstanceCollection from 'collections/InstanceCollection';
import _ from 'underscore';
import Utils from 'actions/Utils';
import InstanceConstants from 'constants/InstanceConstants';
import InstanceState from 'models/InstanceState';

var InstanceStore = BaseStore.extend({
    collection: InstanceCollection,

    queryParams: {
        page_size: 100
    },

    initialize: function() {
        this.pollingEnabled = true;
        this.pollingFrequency = 10 * 1000;
    },

    // ----------------
    // Custom functions
    // ----------------

    getInstancesNotInAProject: function(provider) {
        if (!this.models) return this.fetchModels();

        var instances = this.models.filter(function(instance) {
            return instance.get('projects').length === 0
        });

        return new InstanceCollection(instances);
    },

    // -----------------
    // Polling functions
    // -----------------

    isInFinalState: function(instance) {
        if (instance.get('state').get('status') == 'active' &&
            instance.get('ip_address').charAt(0) == '0') {
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

let store = new InstanceStore();

Dispatcher.register(function(dispatch) {
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

export default store;
