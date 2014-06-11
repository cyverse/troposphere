define(
  [
    'underscore',
    'stores/Store',
    'collections/IdentityCollection',
    'dispatchers/AppDispatcher',
    'constants/IdentityConstants',
    'rsvp'
  ], function(_, Store, IdentityCollection, AppDispatcher, IdentityConstants, RSVP) {

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
        //case IdentityConstants.constants.fetchAll:
        //  IdentityStore.fetchAll();
        //  break;
      }

      return true;
    });

    _.extend(IdentityStore, Store);

    return IdentityStore;

  });
