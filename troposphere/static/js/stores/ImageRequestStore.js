
import Dispatcher from 'dispatchers/Dispatcher';
import BaseStore from 'stores/BaseStore';
import ImageRequestCollection from 'collections/ImageRequestCollection';
import ImageRequestConstants from 'constants/ImageRequestConstants';
import stores from 'stores';

let ImageRequestStore = BaseStore.extend({
    collection: ImageRequestCollection
});

let store = new ImageRequestStore();

Dispatcher.register(function(dispatch) {
    var actionType = dispatch.action.actionType;
    var payload = dispatch.action.payload;
    var options = dispatch.action.options || options;

    switch (actionType) {
        case ImageRequestConstants.UPDATE:
            store.update(payload.model);
            break;

        case ImageRequestConstants.REMOVE:
            store.remove(payload.model);
            break;

        case ImageRequestConstants.EMIT_CHANGE:
            break;

        default:
            return true;
    }

    if (!options.silent) {
        store.emitChange();
    }

    return true;
});

store.lastUpdated = Date.now();

export default store;
