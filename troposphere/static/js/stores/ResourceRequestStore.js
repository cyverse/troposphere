
import Dispatcher from 'dispatchers/Dispatcher';
import BaseStore from 'stores/BaseStore';
import ResourceRequestCollection from 'collections/ResourceRequestCollection';
import ResourceRequestConstants from 'constants/ResourceRequestConstants';
import stores from 'stores';

let ResourceRequestStore = BaseStore.extend({
    collection: ResourceRequestCollection
});

let store = new ResourceRequestStore();

Dispatcher.register(function(dispatch) {
    var actionType = dispatch.action.actionType;
    var payload = dispatch.action.payload;
    var options = dispatch.action.options || options;

    switch (actionType) {
        case ResourceRequestConstants.ADD:
            store.add({data: payload.model, at: 0});
            break;

        case ResourceRequestConstants.UPDATE:
            store.update(payload.model);
            break;

        case ResourceRequestConstants.REMOVE:
            store.remove(payload.model);
            break;

        case ResourceRequestConstants.EMIT_CHANGE:
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
