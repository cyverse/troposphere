define(
  [
    'underscore',
    'stores/Store',
    'collections/SizeCollection',
    'dispatchers/AppDispatcher'
  ],
  function (_, Store, Collection, AppDispatcher) {

    var _models = null;
    var _isFetching = false;

    var _modelsFor = {};
    var _isFetchingFor = {};

    var fetchSizes = function () {
      if(!_isFetching) {
        _isFetching = true;
        var sizes = new Collection();
        sizes.fetch().done(function () {
          _isFetching = false;
          _models = sizes;
          ModelStore.emitChange();
        });
      }
    };

    var fetchModelsFor = function(providerId){
      if(!_modelsFor[providerId] && !_isFetchingFor[providerId]) {
        _isFetchingFor[providerId] = true;
        var models = new Collection();
        models.fetch({
          url: models.url() + "?provider__id=" + providerId + "&page_size=100"
        }).done(function () {
          _isFetchingFor[providerId] = false;
          var sizes = new Collection(models, {parse: true});
          _modelsFor[providerId] = sizes;
          ModelStore.emitChange();
        });
      }
    };

    var ModelStore = {

      getAll: function () {
        if(!_models) {
          fetchSizes();
        } else {
          return _models;
        }
      },

      get: function (modelId) {
        if(!_models) {
          fetchSizes();
        }else{
          return _models.get(modelId);
        }
      },

      getSizesFor: function(provider){
        if(!_modelsFor[provider.id]) return fetchModelsFor(provider.id);

        return _modelsFor[provider.id];
      }

    };

    AppDispatcher.register(function (payload) {
      var action = payload.action;

      switch (action.actionType) {
        default:
          return true;
      }

      ModelStore.emitChange();

      return true;
    });

    _.extend(ModelStore, Store);

    return ModelStore;

  });
