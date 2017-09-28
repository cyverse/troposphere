import BaseStore from "stores/BaseStore";
import SSHKeyConstants from "constants/SSHKeyConstants"
import SSHKeyCollection from "collections/SSHKeyCollection";
import Dispatcher from "dispatchers/Dispatcher";

var SSHKeyStore = BaseStore.extend({
    collection: SSHKeyCollection
});

let store = new SSHKeyStore();

Dispatcher.register(function(dispatch) {
    var actionType = dispatch.action.actionType;
    var payload = dispatch.action.payload;
    var options = dispatch.action.options || options;

    switch (actionType) {
        case SSHKeyConstants.ADD_SSH_KEY:
            store.add(payload.sshKey);
            break;

        case SSHKeyConstants.REMOVE_SSH_KEY:
            store.remove(payload.sshKey);
            break;

        case SSHKeyConstants.UPDATE_SSH_KEY:
            store.update(payload.sshKey);
            break;

        case SSHKeyConstants.EMIT_CHANGE:
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
