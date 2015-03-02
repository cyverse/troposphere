define(
  [
    'underscore',
    'stores/Store',
    'collections/ProviderCollection',
    'dispatchers/AppDispatcher'
  ],
  function (_, Store, ProviderCollection, AppDispatcher) {

    var _providers = null;
    var _isFetching = false;

    //
    // CRUD Operations
    //

    var fetchProviders = function () {
      _isFetching = true;
      var providers = new ProviderCollection();

      providers.fetch().done(function () {
        _isFetching = false;
        _providers = providers;
        ProviderStore.emitChange();
      });
    };

    //
    // Provider Store
    //

    var ProviderStore = {
      getAll: function () {
        if(!_providers && !_isFetching) {
          fetchProviders();
        }
        return _providers;
      },

      get: function (providerId) {
        if(!_providers && !_isFetching) {
          fetchProviders();
        }else{
          return _providers.get(providerId);
        }
      }
    };

    AppDispatcher.register(function (payload) {
      var action = payload.action;
      switch (action.actionType) {
        // case ProviderConstants.FETCH_ALL:
        //   fetchProviders();
        //   break;
      }

      return true;
    });

    _.extend(ProviderStore, Store);

    return ProviderStore;

  });
