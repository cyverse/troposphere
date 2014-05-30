define(
  [
    'underscore',
    'stores/store',
    'collections/providers',
    'dispatchers/app_dispatcher',
    'actions/providers',
    'rsvp'
  ], function(_, Store, ProviderCollection, AppDispatcher, ProviderActions, RSVP) {

  var _providers = new ProviderCollection();

  var Providers = {
    fetchAll: function() {
      return new RSVP.Promise(function(resolve, reject) {
        var providers = new ProviderCollection();
        providers.fetch().done(function() {
          resolve(providers);
        });
      });
    }
  };

  var ProviderStore = {
    getAll: function() {
      return _providers;
    },
    fetchAll: function() {
      Providers.fetchAll().then(function(coll) {
        _providers = coll;
        this.emitChange()
      }.bind(this));
    }
  };

  AppDispatcher.register(function(payload) {
    var action = payload.action;
    switch(action.actionType) {
      case ProviderActions.constants.fetchAll:
        ProviderStore.fetchAll();
        break;
    }

    return true;
  });
  
  _.extend(ProviderStore, Store);

  return ProviderStore;

});
