define(function (require) {

  var Dispatcher = require('dispatchers/Dispatcher'),
    BaseStore = require('stores/BaseStore'),
    IdentityMembershipCollection = require('collections/IdentityMembershipCollection'),
    IdentityMembershipConstants = require('constants/IdentityMemebershipConstants'),
    stores = require('stores');

  var IdentityMembershipStore = BaseStore.extend({
    collection: IdentityMembershipCollection
  });

  var store = new IdentityMembershipStore();

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

  return store;

});
