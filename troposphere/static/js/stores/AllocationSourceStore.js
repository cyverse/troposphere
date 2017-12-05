import BaseStore from "stores/BaseStore";
import AllocationSourceCollection from "collections/AllocationSourceCollection";
import AllocationSourceConstants from "constants/AllocationSourceConstants";
import Dispatcher from "dispatchers/Dispatcher";

let AllocationSourceStore = BaseStore.extend({
    collection: AllocationSourceCollection,
    updateAllocationByUsername({ allocation, username }) {
        let queryString = this.buildQueryStringFromQueryParams({ username });
        let models = this.queryModels[queryString];
        if (!models) {
            return;
        }
        models.add(allocation, { merge: true });
    }
});

let store = new AllocationSourceStore();

Dispatcher.register(function(dispatch) {
    var actionType = dispatch.action.actionType;
    var payload = dispatch.action.payload;
    var options = dispatch.action.options || options;

    switch (actionType) {
        case AllocationSourceConstants.UPDATE:
            store.updateAllocationByUsername(payload);
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

