import _ from 'underscore';
import BaseStore from 'stores/BaseStore';
import Dispatcher from 'dispatchers/Dispatcher';
import Store from 'stores/Store';
import Constants from 'constants/ResourceRequestConstants';
import Collection from 'collections/AllocationCollection';
import stores from 'stores';


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

export default ModelStore;
