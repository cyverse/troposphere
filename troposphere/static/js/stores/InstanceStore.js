define(
  [
    'underscore',
    'dispatchers/dispatcher',
    'stores/Store',
    'rsvp',
    'collections/instances',
    'constants/InstanceConstants',
    'controllers/notifications',
    'stores/IdentityStore'
  ],
  function (_, Dispatcher, Store, RSVP, InstanceCollection, InstanceConstants, NotificationController, IdentityStore) {

    var _instances = null;
    var _isFetching = false;

    //
    // CRUD Operations
    //

    var fetchInstancesFor = function (providerId, identityId) {
      var promise = new RSVP.Promise(function (resolve, reject) {
        var instances = new InstanceCollection(null, {
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

    var fetchInstances = function (identities) {
      _isFetching = true;
      var promise = new RSVP.Promise(function (resolve, reject) {
        // return an array of promises (one for each volume collection being fetched)
        var promises = identities.map(function (identity) {
          var providerId = identity.get('provider_id');
          var identityId = identity.get('id');
          return fetchInstancesFor(providerId, identityId);
        });

        // When all instance collections are fetched...
        RSVP.all(promises).then(function (instanceCollections) {
          // Combine results into a single volume collection
          var instances = new InstanceCollection();
          for (var i = 0; i < instanceCollections.length; i++) {
            instances.add(instanceCollections[i].toJSON());
          }
          // Save the results to local cache
          _isFetching = false;
          _instances = instances;
          resolve();
        });
      });
      return promise;
    };

    //
    // Instance Store
    //

    var InstanceStore = {

      getAll: function () {
        if(!_instances && !_isFetching) {
          var identities = IdentityStore.getAll();
          if(identities) {
            fetchInstances(identities).then(function () {
              InstanceStore.emitChange();
            }.bind(this));
          }
        }
        return _instances;
      }

    };

    Dispatcher.register(function (payload) {
      var action = payload.action;

      switch (action.actionType) {
        //case ProjectConstants.PROJECT_CREATE:
        //  create(action.model);
        //  break;

        default:
          return true;
      }

      InstanceStore.emitChange();

      return true;
    });

    _.extend(InstanceStore, Store);

    return InstanceStore;
  });
