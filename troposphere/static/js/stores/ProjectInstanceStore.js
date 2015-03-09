define(function (require) {

  var _ = require('underscore'),
      Dispatcher = require('dispatchers/Dispatcher'),
      Store = require('stores/Store'),
      Collection = require('collections/ProjectInstanceCollection'),
      Constants = require('constants/ProjectInstanceConstants'),
      InstanceCollection = require('collections/InstanceCollection'),
      Instance = require('models/Instance'),
      stores = require('stores');

  var _models = new Collection();
  var _isFetching = false;

  var _modelsFor = {};
  var _isFetchingFor = {};

  //
  // CRUD Operations
  //

  var fetchModels = function () {
    if(!_models && !_isFetching) {
      _isFetching = true;
      var models = new Collection();
      models.fetch().done(function () {
        _isFetching = false;
        _models = models;
        ModelStore.emitChange();
      });
    }
  };

  var fetchModelsFor = function(projectId){
    if(!_modelsFor[projectId] && !_isFetchingFor[projectId]) {
      _isFetchingFor[projectId] = true;
      var models = new Collection();
      models.fetch({
        url: models.url + "?project__id=" + projectId
      }).done(function () {
        _isFetchingFor[projectId] = false;

        // add models to existing cache
        _models.add(models.models);

        // convert ProjectInstance collection to an InstanceCollection
        var instances = models.map(function(pi){
          return new Instance(pi.get('instance'), {parse: true});
        });
        instances = new InstanceCollection(instances);

        _modelsFor[projectId] = instances;
        ModelStore.emitChange();
      });
    }
  };

  function add(model){
    _models.add(model);
  }

  function remove(model){
    _models.remove(model);
  }


  //
  // Model Store
  //

  var ModelStore = {

    get: function (projectInstanceId) {
      if(!_models) {
        fetchModels();
      } else {
        return _models.get(projectInstanceId);
      }
    },

    getAll: function () {
      if(!_models) {
        fetchModels()
      }
      return _models;
    },

    getProjectInstanceFor: function(project, instance){
      return _models.find(function(pm){
        return pm.get('project').id === project.id && pm.get('instance').id === instance.id;
      });
    },

    getInstancesFor: function(project){
      var allInstances = stores.InstanceStore.getAll();
      if(!_modelsFor[project.id]) return fetchModelsFor(project.id);
      if(!allInstances) return;

      // convert ProjectVolume collection to an VolumeCollection
      var projectInstances = _models.filter(function(pi){
        return pi.get('instance').projects.indexOf(project.id) >= 0;
      });

      var instances = projectInstances.map(function(pi){
        return allInstances.get(pi.get('instance').id);
      });
      return new InstanceCollection(instances);
    },

    getInstancesForProjectOnProvider: function(project, provider){
      // get instances in project
      var instances = this.getInstancesFor(project);

      // filter out instances not on provider
      var instances = instances.filter(function(i){
        return i.get('provider').id === provider.id;
      });

      return new InstanceCollection(instances);
    }

  };

  Dispatcher.register(function (dispatch) {
    var actionType = dispatch.action.actionType;
    var payload = dispatch.action.payload;
    var options = dispatch.action.options || options;

    switch (actionType) {

      case Constants.ADD_PROJECT_INSTANCE:
        add(payload.projectInstance);
        break;

      case Constants.REMOVE_PROJECT_INSTANCE:
        remove(payload.projectInstance);
        break;

      case Constants.EMIT_CHANGE:
        break;

      default:
        return true;
    }

    if(!options.silent) {
      ModelStore.emitChange();
    }

    return true;
  });

  _.extend(ModelStore, Store);

  return ModelStore;
});
