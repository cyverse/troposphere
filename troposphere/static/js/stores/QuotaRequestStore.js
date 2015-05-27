define(function (require) {

  var Dispatcher = require('dispatchers/Dispatcher'),
      BaseStore = require('stores/BaseStore'),
      QuotaRequestCollection = require('collections/QuotaRequestCollection'),
      QuotaRequestConstants = require('constants/QuotaRequestConstants'),
      stores = require('stores');

  var QuotaRequestStore = BaseStore.extend({
    collection: QuotaRequestCollection
  });

  var store = new QuotaRequestStore();

  Dispatcher.register(function (dispatch) {
    var actionType = dispatch.action.actionType;
    var payload = dispatch.action.payload;
    var options = dispatch.action.options || options;

    switch (actionType) {
      case QuotaRequestConstants.UPDATE:
        store.update(payload.model);
        break;

      case QuotaRequestConstants.REMOVE:
        store.remove(payload.model);
        break;

      case QuotaRequestConstants.EMIT_CHANGE:
        break;

      default:
        return true;
    }

    if(!options.silent) {
      store.emitChange();
    }

    return true;
  });

  return store;

});
