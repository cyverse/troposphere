define(
  [
    'underscore',
    'dispatchers/Dispatcher',
    'stores/Store',
    'rsvp',
    'collections/VolumeCollection',
    'constants/VolumeConstants',
    'controllers/NotificationController',
    'stores/IdentityStore'
  ],
  function (_, Dispatcher, Store, RSVP, VolumeCollection, VolumeConstants, NotificationController, IdentityStore) {

    var _volumes = null;
    var _isFetching = false;

    //
    // CRUD Operations
    //

    var fetchVolumesFor = function (providerId, identityId) {
      var promise = new RSVP.Promise(function (resolve, reject) {
        var volumes = new VolumeCollection(null, {
          provider_id: providerId,
          identity_id: identityId
        });
        // make sure promise returns the right instances collection
        // for when this function is called multiple times
        (function(volumes, resolve){
          volumes.fetch().done(function(){
            resolve(volumes);
          });
        })(volumes, resolve)
      });
      return promise;
    };

    var fetchVolumes = function (identities) {
      _isFetching = true;
      var promise = new RSVP.Promise(function (resolve, reject) {
        // return an array of promises (one for each volume collection being fetched)
        var promises = identities.map(function (identity) {
          var providerId = identity.get('provider_id');
          var identityId = identity.get('id');
          return fetchVolumesFor(providerId, identityId);
        });

        // When all volume collections are fetched...
        RSVP.all(promises).then(function (volumeCollections) {
          // Combine results into a single volume collection
          var volumes = new VolumeCollection();
          for (var i = 0; i < volumeCollections.length; i++) {
            volumes.add(volumeCollections[i].toJSON());
          }
          // Save the results to local cache
          _isFetching = false;
          _volumes = volumes;
          resolve();
        });
      });
      return promise;
    };

    //
    // Volume Store
    //

    var VolumeStore = {

      getAll: function () {
        if(!_volumes && !_isFetching) {
          var identities = IdentityStore.getAll();
          if(identities) {
            fetchVolumes(identities).then(function () {
              VolumeStore.emitChange();
            }.bind(this));
          }
        }
        return _volumes;
      }

    };

    Dispatcher.register(function (payload) {
      var action = payload.action;

      switch (action.actionType) {
        //case VolumeConstants.VOLUME_CREATE:
        //  create(action.model);
        //  break;

        default:
          return true;
      }

      VolumeStore.emitChange();

      return true;
    });

    _.extend(VolumeStore, Store);

    return VolumeStore;
  });
