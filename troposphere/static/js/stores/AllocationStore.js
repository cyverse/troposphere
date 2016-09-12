import BaseStore from "stores/BaseStore";
import Dispatcher from "dispatchers/Dispatcher";
import AllocationConstants from "constants/AllocationConstants";
import AllocationCollection from "collections/AllocationCollection";

let AllocationStore = BaseStore.extend({
    collection: AllocationCollection
});
let store = new AllocationStore();

Dispatcher.register(function(dispatch) {
    var actionType = dispatch.action.actionType;
    var payload = dispatch.action.payload;
    var options = dispatch.action.options || options;

    switch (actionType) {
        case AllocationConstants.CREATE_ALLOCATION:
            store.add(payload.allocation);
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
