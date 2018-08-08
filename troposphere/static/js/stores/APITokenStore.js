import BaseStore from "stores/BaseStore";
import APITokenConstants from "constants/APITokenConstants";
import APITokenCollection from "collections/APITokenCollection";
import Dispatcher from "dispatchers/Dispatcher";

var APITokenStore = BaseStore.extend({
    collection: APITokenCollection
});

let store = new APITokenStore();
Dispatcher.register(function(dispatch) {
    var actionType = dispatch.action.actionType;
    var payload = dispatch.action.payload;
    var options = dispatch.action.options || options;

    switch (actionType) {
        case APITokenConstants.ADD_TOKEN:
            store.add(payload.sshKey);
            break;

        case APITokenConstants.REMOVE_TOKEN:
            store.remove(payload.sshKey);
            break;

        case APITokenConstants.UPDATE_TOKEN:
            store.update(payload.sshKey);
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
