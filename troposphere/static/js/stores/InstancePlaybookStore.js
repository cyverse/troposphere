import BaseStore from "stores/BaseStore";
import InstancePlaybookCollection from "collections/InstancePlaybookCollection";
import InstanceConstants from "constants/InstanceConstants";
import Dispatcher from "dispatchers/Dispatcher";

let InstancePlaybookStore = BaseStore.extend({
    collection: InstancePlaybookCollection,

    initialize: function() {
        this.pollingEnabled = true;
        this.pollingFrequency = 15 * 1000;
    },

    isInFinalState: function(instance_playbook) {
        return instance_playbook.isInFinalState();
    },

    getForInstance: function(instance) {
        if(!this.models) {
            this.fetchModels();
            return;
        }
        var playbooks = this.findWhere({
            "instance.uuid": instance.get('uuid')
        });

        return playbooks;
    },
});

let store = new InstancePlaybookStore();
store.lastUpdated = Date.now();

Dispatcher.register(function(dispatch) {
    var actionType = dispatch.action.actionType;
    var options = dispatch.action.options || options;

    switch (actionType) {

        case InstanceConstants.INSTANCE_SHARE_ACCESS:
            //Force a new set of InstancePlaybooks
            store.clearCache();
            store.lastUpdated = Date.now();
            store.getAll();
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
