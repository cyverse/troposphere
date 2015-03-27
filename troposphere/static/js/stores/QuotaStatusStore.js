define(function (require) {

  var _ = require('underscore'),
      Dispatcher = require('dispatchers/Dispatcher'),
      Store = require('stores/Store'),
      Collection = require('collections/QuotaStatusCollection'),
      stores = require('stores');

  var _models = null;
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

  //
  // Model Store
  //

  var ModelStore = {

    get: function (modelId) {
      if(!_models) {
        fetchModels();
      } else {
        return _models.get(modelId);
      }
    },

    getAll: function () {
      if(!_models) {
        fetchModels()
      }
      return _models;
    },

    getStatusWithName: function(text) {
      if(!_models){
        return fetchModels();
      }
      return _models.findWhere({name: text});
    }

  };

  _.extend(ModelStore, Store);
  return ModelStore;
});
