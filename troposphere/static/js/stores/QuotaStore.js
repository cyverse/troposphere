import BaseStore from "stores/BaseStore";
import QuotaCollection from "collections/QuotaCollection";
import Dispatcher from "dispatchers/Dispatcher";
import QuotaConstants from "constants/QuotaConstants";

let QuotaStore = BaseStore.extend({
    collection: QuotaCollection,

    queryParams: {
        page_size: 1000
    }
});

var store = new QuotaStore();

Dispatcher.register(function(dispatch) {
    var actionType = dispatch.action.actionType;
    var payload = dispatch.action.payload;
    var options = dispatch.action.options || options;

    switch (actionType) {
        case QuotaConstants.CREATE_QUOTA:
            store.add(payload.quota);
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
