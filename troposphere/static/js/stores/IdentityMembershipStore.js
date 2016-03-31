import Dispatcher from 'dispatchers/Dispatcher';
import BaseStore from 'stores/BaseStore';
import IdentityMembershipCollection from 'collections/IdentityMembershipCollection';
import IdentityMembershipConstants from 'constants/IdentityMembershipConstants';
import stores from 'stores';

let IdentityMembershipStore = BaseStore.extend({
    collection: IdentityMembershipCollection
});

let store = new IdentityMembershipStore();

Dispatcher.register(function (dispatch) {
    var actionType = dispatch.action.actionType;
    var payload = dispatch.action.payload;
    var options = dispatch.action.options || options;

    switch (actionType) {
      case IdentityMembershipConstants.UPDATE:
        store.update(payload.model);
        break;

      case IdentityMembershipConstants.REMOVE:
        store.remove(payload.model);
        break;

      case IdentityMembershipConstants.EMIT_CHANGE:
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
