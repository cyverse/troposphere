define(
  [
    'underscore',
    'stores/store',
    'collections/identities',
    'dispatchers/app_dispatcher',
    'actions/identities',
    'rsvp'
  ], function(_, Store, Identities, AppDispatcher, IdentityActions, RSVP) {

    var getIdentities = function() {
        return new RSVP.Promise(function (resolve, reject) {
          new Identities().fetch({
            success: function (m) {
              resolve(m);
            }
          });
        });
    };

    var _identities = null;

    var IdentityStore = {
      getAll: function() {
        return _identities;
      },
      fetchAll: function() {
        getIdentities().then(function(coll) {
          _identities = coll;
          this.emitChange();
        }.bind(this));
      }
    };

    AppDispatcher.register(function(payload) {
      var action = payload.action;
      switch(action.actionType) {
        case IdentityActions.constants.fetchAll:
          IdentityStore.fetchAll();
          break;
      }

      return true;
    });

    _.extend(IdentityStore, Store);

    return IdentityStore;

  });
