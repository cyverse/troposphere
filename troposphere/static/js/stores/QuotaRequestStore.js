define(function (require) {

  var _ = require('underscore'),
      Dispatcher = require('dispatchers/Dispatcher'),
      Store = require('stores/Store'),
      Collection = require('collections/QuotaRequestCollection'),
      Constants = require('constants/QuotaRequestConstants'),
      stores = require('stores');

  var _models = null;
  var _pendingModels = null;
  var _isFetching = false;

  //
  // CRUD Operations
  //

  var fetchModels = function () {
    if(!_models && !_isFetching) {
      _isFetching = true;
      var models = new Collection();
      models.fetch().done(function () {
        _isFetching = false;
        _models = models;
        ModelStore.emitChange();
      });
    }
  };

  function add(model){
    _models.add(model);
  }

  function remove(model){
    _models.remove(model);
  }

  function update(model){
    var existingModel = _models.get(model);
    if(!existingModel) throw new Error("Model doesn't exist");
    _models.add(model, {merge: true});
  }

  //
  // Model Store
  //

  var ModelStore = {

    get: function (modelId) {
      if (!_models) {
        fetchModels();
      } else {
        return _models.get(modelId);
      }
    },

    getAll: function () {
      if (!_models) {
        fetchModels();
      }
      return _models;
    },

    getAllPending: function () {
      if (!_models) {
        return fetchModels();
      }

      var pendingRequests = _models.filter(function(model){
        return model.get("status").name === "pending";
      });

      return new Collection(pendingRequests);
    }

  };

  Dispatcher.register(function (dispatch) {
    var actionType = dispatch.action.actionType;
    var payload = dispatch.action.payload;
    var options = dispatch.action.options || options;

    switch (actionType) {
      case Constants.EMIT_CHANGE:
        break;

      case Constants.UPDATE:
        update(payload.model);
        break;

      case Constants.REMOVE:
        remove(payload.model);
        break;

      default:
        return true;
    }

    if(!options.silent) {
      ModelStore.emitChange();
    }

    return true;
  });

  _.extend(ModelStore, Store);
  return ModelStore;
});
