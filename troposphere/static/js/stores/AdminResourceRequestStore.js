import Dispatcher from "dispatchers/Dispatcher";
import BaseStore from "stores/BaseStore";
import AdminResourceRequestCollection from "collections/AdminResourceRequestCollection";
import AdminResourceRequestConstants from "constants/AdminResourceRequestConstants";

let AdminResourceRequestStore = BaseStore.extend({
    collection: AdminResourceRequestCollection,
    queryParams: {
        page_size: 1000
    },
});

let store = new AdminResourceRequestStore();

Dispatcher.register(function(dispatch) {
    var actionType = dispatch.action.actionType;
    var payload = dispatch.action.payload;
    var options = dispatch.action.options || options;

    switch (actionType) {
        case AdminResourceRequestConstants.ADD:
            store.add({
                data: payload.model,
                at: 0
            });
            break;

        case AdminResourceRequestConstants.UPDATE:
            store.update(payload.model);
            break;

        case AdminResourceRequestConstants.REMOVE:
            store.remove(payload.model);
            break;

        case AdminResourceRequestConstants.EMIT_CHANGE:
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
