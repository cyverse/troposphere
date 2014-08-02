define(
  [
    'underscore',
    'stores/Store',
    'collections/IdentityCollection',
    'dispatchers/AppDispatcher'
  ],
  function(_, Store, IdentityCollection, AppDispatcher) {

    var _identities = null;
    var _isFetching = false;

    //
    // CRUD Operations
    //

    var fetchIdentities = function() {
      if(!_isFetching) {
        _isFetching = true;
        var identities = new IdentityCollection();
        identities.fetch().done(function () {
          _isFetching = false;
          _identities = identities;
          IdentityStore.emitChange();
        });
      }
    };

    //
    // Identity Store
    //

    var IdentityStore = {
      getAll: function() {
        if(!_identities) {
          fetchIdentities()
        }
        return _identities;
      }
    };

    AppDispatcher.register(function(payload) {
      var action = payload.action;
      switch(action.actionType) {
        // add actions here
      }

      return true;
    });

    _.extend(IdentityStore, Store);

    return IdentityStore;

  });
