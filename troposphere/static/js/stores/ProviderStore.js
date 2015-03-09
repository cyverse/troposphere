define(function (require) {

  var _ = require('underscore'),
      Store = require('stores/Store'),
      Collection = require('collections/ProviderCollection'),
      AppDispatcher = require('dispatchers/AppDispatcher');

  var _providers = null;
  var _isFetching = false;

  //
  // CRUD Operations
  //

  var fetchModels = function () {
    if(!_providers && !_isFetching) {
      _isFetching = true;
      var providers = new Collection();

      providers.fetch().done(function () {
        _isFetching = false;
        _providers = providers;
        ModelStore.emitChange();
      });
    }
  };

  //
  // Provider Store
  //

  var ModelStore = {
    getAll: function () {
      if(!_providers) {
        fetchModels();
      }
      return _providers;
    },

    get: function (providerId) {
      if(!_providers) {
        fetchModels();
      }else{
        return _providers.get(providerId);
      }
    }
  };

  AppDispatcher.register(function (payload) {
    var action = payload.action;
    switch (action.actionType) {
      // case ProviderConstants.FETCH_ALL:
      //   fetchModels();
      //   break;
    }

    return true;
  });

  _.extend(ModelStore, Store);

  return ModelStore;

});
