define(
  [
    'underscore',
    'stores/store',
    'collections/identities',
    'dispatchers/app_dispatcher',
    'constants/IdentityConstants',
    'rsvp'
  ], function(_, Store, IdentityCollection, AppDispatcher, IdentityConstants, RSVP) {

    var _identities = null;
    var _isFetching = false;

    //
    // CRUD Operations
    //

    var fetchIdentities = function() {
      _isFetching = true;
      var promise = new RSVP.Promise(function (resolve, reject) {
        var identities = new IdentityCollection();
        identities.fetch().done(function () {
          _isFetching = false;
          _identities = identities;
          resolve();
        });
      });
      return promise;
    };

    //
    // Identity Store
    //

    var IdentityStore = {
      getAll: function() {
        if(!_identities && !_isFetching) {
          fetchIdentities().then(function(){
            IdentityStore.emitChange();
          }.bind(this));
        }
        return _identities;
      },

      fetchAll: function() {
        fetchIdentities().then(function(coll) {
          IdentityStore.emitChange();
        });
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
