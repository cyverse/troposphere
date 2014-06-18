define(
  [
    'underscore',
    'dispatchers/Dispatcher',
    'stores/Store',
    'rsvp',
    'collections/VolumeCollection',
    'models/Volume',
    'constants/VolumeConstants',
    'controllers/NotificationController',
    'stores/IdentityStore',
    'components/notifications/VolumeAttachNotifications.react'
  ],
  function (_, Dispatcher, Store, RSVP, VolumeCollection, Volume, VolumeConstants, NotificationController, IdentityStore, VolumeAttachNotifications) {

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
      if(!_isFetching && identities) {
        _isFetching = true;

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
          VolumeStore.emitChange();
        });
      }
    };

    var detach = function(volume){
      volume.detach({
        success: function (model) {
          NotificationController.success("Success", "Your volume was detached.  It is now available to attach to another instance or destroy.");
          VolumeStore.emitChange();
        },
        error: function (message, response) {
          NotificationController.error("Error", "Your volume could not be detached :(");
          VolumeStore.emitChange();
        }
      });
    };

    var destroy = function(volume){
      volume.remove({
        success: function (model) {
          NotificationController.success("Success", "Your volume was destroyed.");
          VolumeStore.emitChange();
        },
        error: function (message, response) {
          NotificationController.error("Error", "Your volume could not be destroyed :(");
          VolumeStore.emitChange();
        }
      });
    };


    var attach = function(volume, instance, mountLocation){
      volume.attachTo(instance, mountLocation, {
        success: function (response) {
          var title = "Volume Successfully Attached";
          var successMessage = VolumeAttachNotifications.success();
          NotificationController.success(title, successMessage);
          VolumeStore.emitChange();
        },
        error: function (response) {
          var header = "Volume could not be attached :(";
          var errorMessage = VolumeAttachNotifications.success();
          NotificationController.success(title, errorMessage);
          VolumeStore.emitChange();
        }
      });
    };

    var create = function(volumeName, volumeSize, identity){
      var volume = new Volume({
        identity: {
          id: identity.id,
          provider: identity.get('provider_id')
        },
        name: volumeName,
        description: "",
        size: volumeSize
      });

      var params = {
        model_name: "volume",
        tags: "CF++"
      };

      volume.save(params, {
        success: function (model) {
          NotificationController.success('Success', 'Volume successfully created');
          VolumeStore.emitChange();
        },
        error: function (response) {
          NotificationController.error('Error', 'Volume could not be created :(');
          _volumes.remove(volume);
          VolumeStore.emitChange();
        }
      });
      _volumes.add(volume);
    };


    //
    // Volume Store
    //

    var VolumeStore = {

      getAll: function () {
        if(!_volumes && !_isFetching) {
          var identities = IdentityStore.getAll();
          if(identities) {
            fetchVolumes(identities);
          }
        }
        return _volumes;
      },

      get: function (volumeId) {
        if(!_volumes) {
          var identities = IdentityStore.getAll();
          if(identities) {
            fetchVolumes(identities);
          }
        } else {
          return _volumes.get(volumeId);
        }
      }

    };

    Dispatcher.register(function (payload) {
      var action = payload.action;

      VolumeStore.emitChange();

      switch (action.actionType) {
        case VolumeConstants.VOLUME_DETACH:
          detach(action.volume);
          break;

        case VolumeConstants.VOLUME_DESTROY:
          destroy(action.volume);
          break;

        case VolumeConstants.VOLUME_ATTACH:
          attach(action.volume, action.instance, action.mountLocation);
          break;

        case VolumeConstants.VOLUME_CREATE:
          create(action.volumeName, action.volumeSize, action.identity);
          break;

        default:
          return true;
      }

      return true;
    });

    _.extend(VolumeStore, Store);

    return VolumeStore;
  });
