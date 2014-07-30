define(
  [
    'underscore',
    'dispatchers/Dispatcher',
    'stores/Store',
    'rsvp',
    'collections/InstanceCollection',
    'models/Instance',
    'constants/InstanceConstants',
    'constants/ProjectInstanceConstants',
    'controllers/NotificationController',
    'stores/IdentityStore',
    'actions/ProjectActions',
    './helpers/ProjectInstance',
    'models/InstanceState'
  ],
  function (_, Dispatcher, Store, RSVP, InstanceCollection, Instance, InstanceConstants, ProjectInstanceConstants, NotificationController, IdentityStore, ProjectActions, ProjectInstance, InstanceState) {

    var _instances = null;
    var _isFetching = false;
    var pollingFrequency = 10*1000;

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

    function update(instance){
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
    }

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
        }
      });

      instance.set('projects', [project.id]);
      instance.set('state', new InstanceState({status_raw: "build - scheduling"}));

      var params = {
        machine_alias: machineId,
        size_alias: sizeId,
        name: instanceName
      };

      instance.save(params, {
        success: function (model) {
          //NotificationController.success('Launch Instance', 'Instance successfully launched');
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
    // Project Instance Functions
    //

    function addInstanceToProject(instance, project){
      var projectInstance = new ProjectInstance({
        instance: instance,
        project: project
      });

      instance.get('projects').push(project.id);

      projectInstance.save().done(function(){
        // do nothing
      }).fail(function(){
        var failureMessage = "Error adding Instance '" + instance.get('name') + "' to Project '" + project.get('name') + "'.";
        NotificationController.error(failureMessage);

        // remove the instance from the project
        var instanceProjectIds = instance.get('projects');
        var indexOfProjectId = instanceProjectIds.indexOf(project.id);
        if(indexOfProjectId >= 0){
          instance.get('projects').splice(indexOfProjectId, 1);
        }

        InstanceStore.emitChange();
      });

      InstanceStore.emitChange();
    }

    function removeInstanceFromProject(instance, project){
      var projectInstance = new ProjectInstance({
        instance: instance,
        project: project
      });

      // remove the instance from the project
      var instanceProjectIds = instance.get('projects');
      var indexOfProjectId = instanceProjectIds.indexOf(project.id);
      if(indexOfProjectId >= 0){
        instance.get('projects').splice(indexOfProjectId, 1);
      }

      projectInstance.destroy().done(function(){
        // do nothing
      }).fail(function(){
        var failureMessage = "Error removing Instance '" + instance.get('name') + "' from Project '" + project.get('name') + "'.";
        NotificationController.error(failureMessage);

        // add the instance back to the project
        instance.get('projects').push(project.id);

        InstanceStore.emitChange();
      });

      InstanceStore.emitChange();
    }

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
      },

      getInstancesInProject: function (project) {
        _instances = _instances || new InstanceCollection();

        _instances.add(project.get('instances').models);

        var projectInstances = _instances.filter(function(instance){
          return instance.get('projects').indexOf(project.id) >= 0;
        });

        // Start polling for any instances that are in transition states
        projectInstances.forEach(function(instance){
          // todo: when cached data can be trusted, stop polling real data here
          //if(!instance.get('state').isInFinalState()){
            pollNowUntilBuildIsFinished(instance);
          //}
        });

        var projectInstanceCollection = new InstanceCollection(projectInstances);
        return projectInstanceCollection;
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

        case ProjectInstanceConstants.ADD_INSTANCE_TO_PROJECT:
          addInstanceToProject(action.instance, action.project);
          break;

        case ProjectInstanceConstants.REMOVE_INSTANCE_FROM_PROJECT:
          removeInstanceFromProject(action.instance, action.project);
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
