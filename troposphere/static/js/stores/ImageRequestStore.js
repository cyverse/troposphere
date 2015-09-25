define(function (require) {

  var Dispatcher = require('dispatchers/Dispatcher'),
    BaseStore = require('stores/BaseStore'),
    ImageRequestCollection = require('collections/ImageRequestCollection'),
    ImageRequestConstants = require('constants/ImageRequestConstants'),
    stores = require('stores');

  var ImageRequestStore = BaseStore.extend({
    collection: ImageRequestCollection
  });

  var store = new ImageRequestStore();

  Dispatcher.register(function (dispatch) {
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

  return store;

});
