define(
  [
    'underscore',
    'stores/store',
    'collections/providers',
    'dispatchers/app_dispatcher',
    'constants/ProviderConstants',
    'rsvp'
  ],
  function (_, Store, ProviderCollection, AppDispatcher, ProviderConstants, RSVP) {

    var _providers = null;
    var _isFetching = false;

    //
    // CRUD Operations
    //

    var fetchProviders = function () {
      _isFetching = true;
      var promise = new RSVP.Promise(function (resolve, reject) {
        var providers = new ProviderCollection();
        providers.fetch().done(function () {
          _isFetching = false;
          _providers = providers;
          resolve();
        });
      });
      return promise;
    };

    //
    // Provider Store
    //

    var ProviderStore = {
      getAll: function () {
        if(!_providers && !_isFetching) {
          fetchProviders().then(function(){
            ProviderStore.emitChange();
          });
        }
        return _providers;
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
