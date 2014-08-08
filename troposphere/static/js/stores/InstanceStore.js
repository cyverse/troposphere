define(
  [
    'underscore',
    'dispatchers/Dispatcher',
    'stores/Store',
    'collections/InstanceCollection',
    'models/Instance',
    'constants/InstanceConstants',
    'controllers/NotificationController',
    'stores/IdentityStore',
    'actions/ProjectActions',
    'q'
  ],
  function (_, Dispatcher, Store, InstanceCollection, Instance, InstanceConstants, NotificationController, IdentityStore, ProjectActions, Q) {

    var _instances = new InstanceCollection();
    var _isFetching = false;
    var pollingFrequency = 10*1000;

    //
    // CRUD Operations
    //

    var fetchInstancesFor = function (providerId, identityId) {
      var defer = Q.defer();

      var instances = new InstanceCollection(null, {
        provider_id: providerId,
        identity_id: identityId
      });

      // make sure promise returns the right instances collection
      // for when this function is called multiple times
      (function(instances, defer){
        instances.fetch().done(function(){
          defer.resolve(instances);
        });
      })(instances, defer);

      return defer.promise;
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
        Q.all(promises).done(function (instanceCollections) {
          // Combine results into a single volume collection
          var instances = new InstanceCollection();
          for (var i = 0; i < instanceCollections.length; i++) {
            instances.add(instanceCollections[i].toJSON());
          }

          // Start polling for any instances that are in transition states
          instances.forEach(function(instance){
            if(!instance.get('state').isInFinalState()){
              pollUntilBuildIsFinished(instance);
            }
          });

          // Save the results to local cache
          _isFetching = false;
          _instances = instances;
          InstanceStore.emitChange();
        });
      }
    };

    var update = function(instance){
      instance.save({
        name: instance.get('name'),
        tags: instance.get('tags')
      }, {
        patch: true
      }).done(function(){
        var successMessage = "Instance " + instance.get('name') + " updated.";
        //NotificationController.success(successMessage);
        InstanceStore.emitChange();
      }).fail(function(){
        var failureMessage = "Error updating Instance " + instance.get('name') + ".";
        NotificationController.error(failureMessage);
        InstanceStore.emitChange();
      });
    };

    var addTagToInstance = function(tag, instance){
      var instanceTags = instance.get('tags');
      instanceTags.push(tag.get('name'));
      instance.save({
        tags: instanceTags
      }, {
        patch: true
      }).done(function(){
        InstanceStore.emitChange();
      }).fail(function(){
        var failureMessage = "Error adding tag to Instance";
        NotificationController.error(failureMessage);
        InstanceStore.emitChange();
      });
    };

    //
    // Instance Actions
    //

    var suspend = function(instance){
      instance.suspend({
        success: function (model) {
          //NotificationController.success("Success", "Your instance is now suspended");
          pollUntilBuildIsFinished(instance);
          InstanceStore.emitChange();
        },
        error: function (response) {
          NotificationController.error("Error", "Your instance could not be suspended");
          InstanceStore.emitChange();
        }
      });
    };

    var resume = function(instance){
      instance.resume({
        success: function (model) {
          //NotificationController.success("Success", "Your instance is resuming");
          pollUntilBuildIsFinished(instance);
          InstanceStore.emitChange();
        },
        error: function (response) {
          NotificationController.error("Error", "Your instance could not be resumed");
          InstanceStore.emitChange();
        }
      });
    };

    var stop = function(instance){
      instance.stop({
        success: function (model) {
          //NotificationController.success('Stop Instance', 'Instance successfully stopped');
          pollUntilBuildIsFinished(instance);
          InstanceStore.emitChange();
        },
        error: function (response) {
          NotificationController.error('Error', 'Instance could not be stopped');
          InstanceStore.emitChange();
        }
      });
    };

    var start = function(instance){
      instance.start({
        success: function (model) {
          //NotificationController.success('Start Instance', 'Instance successfully started');
          pollUntilBuildIsFinished(instance);
          InstanceStore.emitChange();
        },
        error: function (response) {
          NotificationController.error('Error', 'Instance could not be started');
          InstanceStore.emitChange();
        }
      });
    };

    var terminate = function(instance){
      instance.destroy({
        success: function (model) {
          pollUntilBuildIsFinished(instance);
          InstanceStore.emitChange();
        },
        error: function (response) {
          NotificationController.error('Error', 'Instance could not be terminated');
          _instances.add(instance);
          InstanceStore.emitChange();
        }
      });
      _instances.remove(instance);
    };

    var launch = function(identity, machineId, sizeId, instanceName, project){
      var instance = new Instance({
        identity: {
          id: identity.id,
          provider: identity.get('provider_id')
        },
        status: "build - scheduling",
        projects: [project.id]
      }, {parse: true});

      var params = {
        machine_alias: machineId,
        size_alias: sizeId,
        name: instanceName
      };

      instance.save(params, {
        success: function (model) {
          NotificationController.success('Launch Instance', 'Instance successfully launched');
          pollUntilBuildIsFinished(instance);
          ProjectActions.addItemToProject(project, instance);
          InstanceStore.emitChange();
        },
        error: function (response) {
          NotificationController.error('Error', 'Instance could not be launched');
          _instances.remove(instance);
          InstanceStore.emitChange();
        }
      });
      _instances.add(instance);
    };

    //
    // Polling Functions
    //

    var _instancesBuilding = [];
    var pollUntilBuildIsFinished = function(instance){
      if(_instancesBuilding.indexOf(instance) < 0) {
        _instancesBuilding.push(instance);
        fetchAndRemoveIfFinished(instance);
      }
    };

    // Poll
    var pollNowUntilBuildIsFinished = function(instance){
      if(_instancesBuilding.indexOf(instance) < 0) {
        _instancesBuilding.push(instance);
        fetchNowAndRemoveIfFinished(instance);
      }
    };

    var fetchAndRemoveIfFinished = function(instance){
      setTimeout(function(){
        instance.fetch().done(function(){
          var index = _instancesBuilding.indexOf(instance);
          if(instance.get('state').isInFinalState()){
            _instancesBuilding.slice(index, 1);
          }else{
            fetchAndRemoveIfFinished(instance);
          }
          InstanceStore.emitChange();
        });
      }, pollingFrequency);
    };

    var fetchNowAndRemoveIfFinished = function(instance){
      instance.fetch().done(function(){
        var index = _instancesBuilding.indexOf(instance);
        if(instance.get('state').isInFinalState()){
          _instancesBuilding.slice(index, 1);
        }else{
          fetchAndRemoveIfFinished(instance);
        }
        InstanceStore.emitChange();
      });
    };

    //
    // Instance Store
    //

    var InstanceStore = {

      // until instances have their own endpoint at /instances
      // we need to either fetch them using identities or the
      // information we get from projects
      getAll: function (projects) {
        if(!projects) throw new Error("Must supply projects");

        projects.each(function(project){
          this.getInstancesInProject(project);
        }.bind(this));

        return _instances;
      },

      // getAll: function () {
      //   if(!_instances) {
      //     var identities = IdentityStore.getAll();
      //     if(identities) {
      //       fetchInstances(identities);
      //     }
      //   }
      //   return _instances;
      // },

      // get: function (instanceId) {
      //   if(!_instances) {
      //     var identities = IdentityStore.getAll();
      //     if(identities) {
      //       fetchInstances(identities);
      //     }
      //   } else {
      //     return _instances.get(instanceId);
      //   }
      // },

      getInstanceInProject: function(project, instanceId){
        var instances = this.getInstancesInProject(project);
        var instance = instances.get(instanceId);
        if(!instance){
          NotificationController.error("Instance not in project", "The instance could not be found in the project");
        }
        return instance;
      },

      getInstancesInProject: function (project) {

        var projectInstanceArray = project.get('instances').map(function(instanceData){
          // todo: we're converting into an instance object here so we can use
          // id instead of alias for consistency. Eventually all alias attributes
          // need to be renamed id and then we can create the object only if
          // the id isn't in the existing map.
          var instance = new Instance(instanceData, {parse: true});
          var existingInstance = _instances.get(instance.id);

          if(existingInstance){
            instance = existingInstance;
          }else{
            _instances.push(instance);
            pollNowUntilBuildIsFinished(instance);
          }

          return instance;
        });

        var projectInstances = new InstanceCollection(projectInstanceArray);
        return projectInstances;
      }

    };

    Dispatcher.register(function (payload) {
      var action = payload.action;

      switch (action.actionType) {
        case InstanceConstants.INSTANCE_UPDATE:
          update(action.instance);
          break;

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
          launch(action.identity, action.machineId, action.sizeId, action.instanceName, action.project);
          break;

        case InstanceConstants.INSTANCE_ADD_TAG:
          addTagToInstance(action.tag, action.instance);
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
