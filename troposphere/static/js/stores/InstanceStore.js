define(
  [
    'underscore',
    'dispatchers/Dispatcher',
    'stores/Store',
    'rsvp',
    'collections/InstanceCollection',
    'models/Instance',
    'constants/InstanceConstants',
    'controllers/NotificationController',
    'stores/IdentityStore'
  ],
  function (_, Dispatcher, Store, RSVP, InstanceCollection, Instance, InstanceConstants, NotificationController, IdentityStore) {

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
      if(!_isFetching && identities) {
        _isFetching = true;

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
          InstanceStore.emitChange();
        });
      }
    };

    var suspend = function(instance){
      instance.suspend({
        success: function (model) {
          NotificationController.success("Success", "Your instance is now suspended");
          InstanceStore.emitChange();
        },
        error: function (response) {
          NotificationController.error("Error", "Your instance could not be suspended :(");
          InstanceStore.emitChange();
        }
      });
    };

    var resume = function(instance){
      instance.resume({
        success: function (model) {
          NotificationController.success("Success", "Your instance is resuming");
          InstanceStore.emitChange();
        },
        error: function (response) {
          NotificationController.error("Error", "Your instance could not be resumed :(");
          InstanceStore.emitChange();
        }
      });
    };

    var stop = function(instance){
      instance.stop({
        success: function (model) {
          NotificationController.success('Stop Instance', 'Instance successfully stopped');
          InstanceStore.emitChange();
        },
        error: function (response) {
          NotificationController.error('Error', 'Instance could not be stopped :(');
          InstanceStore.emitChange();
        }
      });
    };

    var start = function(instance){
      instance.start({
        success: function (model) {
          NotificationController.success('Start Instance', 'Instance successfully started');
          InstanceStore.emitChange();
        },
        error: function (response) {
          NotificationController.error('Error', 'Instance could not be started :(');
          InstanceStore.emitChange();
        }
      });
    };

    var terminate = function(instance){
      instance.destroy({
        success: function (model) {
          NotificationController.success('Terminate Instance', 'Instance termination started');
          InstanceStore.emitChange();
        },
        error: function (response) {
          NotificationController.error('Error', 'Instance could not be terminated :(');
          _instances.add(instance);
          InstanceStore.emitChange();
        }
      });
      _instances.remove(instance);
    };

    var launch = function(identity, machineId, sizeId, instanceName){
      var instance = new Instance({
        identity: {
          id: identity.id,
          provider: identity.get('provider_id')
        }
      });

      var params = {
        machine_alias: machineId,
        size_alias: sizeId,
        name: instanceName
      };

      instance.save(params, {
        success: function (model) {
          NotificationController.success('Launch Instance', 'Instance successfully launched');
          InstanceStore.emitChange();
        },
        error: function (response) {
          NotificationController.error('Error', 'Instance could not be launched :(');
          _instances.remove(instance);
          InstanceStore.emitChange();
        }
      });
      _instances.add(instance);
    };

    //
    // Instance Store
    //

    var InstanceStore = {

      getAll: function () {
        if(!_instances) {
          var identities = IdentityStore.getAll();
          if(identities) {
            fetchInstances(identities);
          }
        }
        return _instances;
      },

      get: function (instanceId) {
        if(!_instances) {
          var identities = IdentityStore.getAll();
          if(identities) {
            fetchInstances(identities);
          }
        } else {
          return _instances.get(instanceId);
        }
      }

    };

    Dispatcher.register(function (payload) {
      var action = payload.action;

      switch (action.actionType) {
        case InstanceConstants.INSTANCE_SUSPEND:
          suspend(action.instance);
          break;

        case InstanceConstants.INSTANCE_RESUME:
          resume(action.instance);
          break;

        case InstanceConstants.INSTANCE_STOP:
          stop(action.instance);
          break;

        case InstanceConstants.INSTANCE_START:
          start(action.instance);
          break;

        case InstanceConstants.INSTANCE_TERMINATE:
          terminate(action.instance);
          break;

        case InstanceConstants.INSTANCE_LAUNCH:
          launch(action.identity, action.machineId, action.sizeId, action.instanceName);
          break;

        default:
          return true;
      }

      InstanceStore.emitChange();

      return true;
    });

    _.extend(InstanceStore, Store);

    return InstanceStore;
  });
