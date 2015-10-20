
import Dispatcher from 'dispatchers/Dispatcher';
import BaseStore from 'stores/BaseStore';
import InstanceCollection from 'collections/InstanceCollection';
import InstanceConstants from 'constants/InstanceConstants';

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
    }

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
            store.pollNowUntilBuildIsFinished(payload.instance);
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
