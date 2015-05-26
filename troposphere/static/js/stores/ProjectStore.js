define(function (require) {

  var _ = require('underscore'),
      Dispatcher = require('dispatchers/Dispatcher'),
      BaseStore = require('stores/BaseStore'),
      ProjectCollection = require('collections/ProjectCollection'),
      ProjectConstants = require('constants/ProjectConstants');

  var store = new BaseStore(null, {
    collection: ProjectCollection
  });

  //
  // CRUD Operations
  //

  function add(project){
    store.models.add(project);
  }

  function update(project){
    var existingModel = store.models.get(project);
    if(!existingModel) throw new Error("Project doesn't exist.");
    store.models.add(project, {merge: true});
  }

  function remove(project){
    store.models.remove(project);
  }

  Dispatcher.register(function (dispatch) {
    var actionType = dispatch.action.actionType;
    var payload = dispatch.action.payload;
    var options = dispatch.action.options || options;

    switch (actionType) {

      case ProjectConstants.ADD_PROJECT:
        add(payload.project);
        break;

      case ProjectConstants.UPDATE_PROJECT:
        update(payload.project);
        break;

      case ProjectConstants.REMOVE_PROJECT:
        remove(payload.project);
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
