define(
  [
    'underscore',
    'dispatchers/Dispatcher',
    'stores/Store',
    'collections/InstanceCollection',
    'models/Instance',
    'constants/InstanceConstants',
    'constants/ProjectInstanceConstants',
    'controllers/NotificationController'
  ],
  function (_, Dispatcher, Store, InstanceCollection, Instance, InstanceConstants, ProjectInstanceConstants, NotificationController) {

    var _instances = new InstanceCollection();
    var _isFetching = false;
    var pollingFrequency = 10*1000;
    var _pendingProjectInstances = {};
    var _instancesBuilding = [];

    //
    // CRUD Operations
    //

    function add(instance) {
      _instances.add(instance);
    }

    function update(instance) {
      var existingModel = _instances.get(instance);
      if (!existingModel) throw new Error("Instance doesn't exist.");
      _instances.add(instance, {merge: true});
    }

    function remove(instance) {
      _instances.remove(instance);
    }

    function addPendingInstanceToProject(instance, project) {
      _pendingProjectInstances[project.id] = _pendingProjectInstances[project.id] || new InstanceCollection();
      _pendingProjectInstances[project.id].add(instance);
    }

    function removePendingInstanceFromProject(instance, project) {
      _pendingProjectInstances[project.id].remove(instance);
    }

    //
    // Polling Functions
    //

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
            _instancesBuilding.splice(index, 1);
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
          _instancesBuilding.splice(index, 1);
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

        // Add any pending instances to the result set
        var pendingProjectInstances = _pendingProjectInstances[project.id];
        if(pendingProjectInstances){
          projectInstanceArray = projectInstanceArray.concat(pendingProjectInstances.models);
        }

        return new InstanceCollection(projectInstanceArray);
      }

    };

    Dispatcher.register(function (dispatch) {
      var actionType = dispatch.action.actionType;
      var payload = dispatch.action.payload;
      var options = dispatch.action.options || options;

      switch (actionType) {

        case InstanceConstants.ADD_INSTANCE:
          add(payload.instance);
          break;

        case InstanceConstants.UPDATE_INSTANCE:
          update(payload.instance);
          break;

        case InstanceConstants.REMOVE_INSTANCE:
          remove(payload.instance);
          break;

        case InstanceConstants.POLL_INSTANCE:
          pollNowUntilBuildIsFinished(payload.instance);
          break;

        case ProjectInstanceConstants.ADD_PENDING_INSTANCE_TO_PROJECT:
          addPendingInstanceToProject(payload.instance, payload.project);
          break;

        case ProjectInstanceConstants.REMOVE_PENDING_INSTANCE_FROM_PROJECT:
          removePendingInstanceFromProject(payload.instance, payload.project);
          break;

        default:
          return true;
      }

      if(!options.silent) {
        InstanceStore.emitChange();
      }

      return true;
    });

    _.extend(InstanceStore, Store);

    return InstanceStore;
  });
