define(function (require) {

  var _ = require('underscore'),
      Dispatcher = require('dispatchers/Dispatcher'),
      BaseStore = require('stores/BaseStore'),
      ProjectCollection = require('collections/ProjectCollection'),
      ProjectConstants = require('constants/ProjectConstants');

  var store = new BaseStore(null, {
    collection: ProjectCollection
  });

  Dispatcher.register(function (dispatch) {
    var actionType = dispatch.action.actionType;
    var payload = dispatch.action.payload;
    var options = dispatch.action.options || options;

    switch (actionType) {

      case ProjectConstants.ADD_PROJECT:
        store.add(payload.project);
        break;

      case ProjectConstants.UPDATE_PROJECT:
        store.update(payload.project);
        break;

      case ProjectConstants.REMOVE_PROJECT:
        store.remove(payload.project);
        break;

      case ProjectConstants.EMIT_CHANGE:
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
