define(
  [
    'underscore',
    'dispatchers/Dispatcher',
    'stores/Store',
    'rsvp',
    'collections/InstanceHistoryCollection',
    'controllers/NotificationController',
    'stores/IdentityStore'
  ],
  function (_, Dispatcher, Store, RSVP, InstanceHistoryCollection, NotificationController, IdentityStore) {

    var _instanceHistories = null;
    var _isFetching = false;

    //
    // CRUD Operations
    //

    var fetchInstanceHistoryFor = function (providerId, identityId) {
      var promise = new RSVP.Promise(function (resolve, reject) {
        var instances = new InstanceHistoryCollection(null, {
          provider_id: providerId,
          identity_id: identityId
        });
        // make sure promise returns the right instances collection
        // for when this function is called multiple times
        (function(instances, resolve){
          instances.fetch().done(function(){
            resolve(instances);
          });
        })(instances, resolve)
      });
      return promise;
    };

    var fetchInstanceHistories = function (identities) {
      if(!_isFetching && identities) {
        _isFetching = true;

        // return an array of promises (one for each volume collection being fetched)
        var promises = identities.map(function (identity) {
          var providerId = identity.get('provider_id');
          var identityId = identity.get('id');
          return fetchInstanceHistoryFor(providerId, identityId);
        });

        // When all instance collections are fetched...
        RSVP.all(promises).then(function (instanceCollections) {
          // Combine results into a single volume collection
          var instances = new InstanceHistoryCollection();
          for (var i = 0; i < instanceCollections.length; i++) {
            instances.add(instanceCollections[i].toJSON());
          }

          // Save the results to local cache
          _isFetching = false;
          _instanceHistories = instances;
          InstanceHistoryStore.emitChange();
        });
      }
    };

    //
    // Instance Store
    //

    var InstanceHistoryStore = {

      getAll: function () {
        if(!_instanceHistories) {
          var identities = IdentityStore.getAll();
          if(identities) {
            fetchInstanceHistories(identities);
          }
        }
        return _instanceHistories;
      }

    };

    Dispatcher.register(function (payload) {
      var action = payload.action;

      switch (action.actionType) {

        default:
          return true;
      }

      InstanceHistoryStore.emitChange();

      return true;
    });

    _.extend(InstanceHistoryStore, Store);

    return InstanceHistoryStore;
  });
