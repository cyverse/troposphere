define(function (require) {

  var _ = require('underscore'),
      Dispatcher = require('dispatchers/Dispatcher'),
      Store = require('stores/Store'),
      Collection = require('collections/QuotaCollection'),
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
      models.fetch({
        url: models.url + "?page_size=100"
      }).done(function () {
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
    }

  };

  _.extend(ModelStore, Store);

  return ModelStore;
});
