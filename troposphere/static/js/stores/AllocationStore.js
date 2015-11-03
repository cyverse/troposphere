define(function (require) {

  var _ = require('underscore'),
    BaseStore = require('stores/BaseStore'),
    Dispatcher = require('dispatchers/Dispatcher'),
    Store = require('stores/Store'),
    AllocationConstants = require('constants/AllocationConstants'),
    AllocationCollection = require('collections/AllocationCollection'),
    stores = require('stores');

  var  AllocationStore = BaseStore.extend({
    collection: AllocationCollection
  }); 

  var store = new AllocationStore();

  Dispatcher.register(function (dispatch) {
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

  return store;
});
