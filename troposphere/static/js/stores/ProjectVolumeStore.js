define(function (require) {

  var _ = require('underscore'),
      Dispatcher = require('dispatchers/Dispatcher'),
      Store = require('stores/Store'),
      Collection = require('collections/ProjectVolumeCollection'),
      Constants = require('constants/ProjectVolumeConstants'),
      VolumeCollection = require('collections/VolumeCollection'),
      Volume = require('models/Volume'),
      stores = require('stores');

  var _models = new Collection();
  var _isFetching = false;

  var _modelsFor = {};
  var _isFetchingFor = {};

  var _pendingProjectVolumes = new Collection();

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

        // convert ProjectVolume collection to an VolumeCollection
        var volumes = models.map(function(pv){
          return new Volume(pv.get('volume'), {parse: true});
        });
        volumes = new VolumeCollection(volumes);

        _modelsFor[projectId] = volumes;
        ModelStore.emitChange();
      });
    }
  };

  function add(model){
    _models.add(model);
  }

  function remove(model){
    _models.remove(model);
    //_modelsFor[model.get('project').id].remove(model.get('volume').id);
  }

  function addPending(model){
    _pendingProjectVolumes.add(model);
  }

  function removePending(model){
    _pendingProjectVolumes.remove(model);
  }


  //
  // Model Store
  //

  var ModelStore = {

    get: function (modelId) {
      if(!_models) {
        fetchModels();
      } else {
        return _models.get(modelId);
      }
    },

    getAll: function () {
      if(!_models) {
        return fetchModels();
      }else{
        return _models;
      }
    },

    getProjectVolumeFor: function(project, volume){
      return _models.find(function(pm){
        return pm.get('project').id === project.id && pm.get('volume').id === volume.id;
      });
    },

    getVolumesFor: function(project){
      var allVolumes = stores.VolumeStore.getAll();
      if(!_modelsFor[project.id]) return fetchModelsFor(project.id);
      if(!allVolumes) return;

      var volumes = _models.filter(function(pv){
        // filter out irrelevant project volumes (not in target project)
        return pv.get('project').id === project.id;
      }).filter(function(pv){
        // filter out the volumes that don't exist (not in local cache)
        return allVolumes.get(pv.get('volume').id);
      }).map(function(pv){
        // return the actual volumes
        return allVolumes.get(pv.get('volume').id);
      });

      var pendingVolumes = _pendingProjectVolumes.filter(function(pv){
        // filter out irrelevant project volumes (not in target project)
        return pv.get('project').id === project.id;
      }).filter(function(pv){
        // filter out the volumes that don't exist (not in local cache)
        return allVolumes.get(pv.get('volume'));
      }).map(function(pv){
        // return the actual volumes
        return allVolumes.get(pv.get('volume'));
      });

      return new VolumeCollection(volumes.concat(pendingVolumes));
    }

  };

  Dispatcher.register(function (dispatch) {
    var actionType = dispatch.action.actionType;
    var payload = dispatch.action.payload;
    var options = dispatch.action.options || options;

    switch (actionType) {

      case Constants.ADD_PROJECT_VOLUME:
        add(payload.projectVolume);
        break;

      case Constants.REMOVE_PROJECT_VOLUME:
        remove(payload.projectVolume);
        break;

      case Constants.ADD_PENDING_PROJECT_VOLUME:
        addPending(payload.projectVolume);
        break;

      case Constants.REMOVE_PENDING_PROJECT_VOLUME:
        removePending(payload.projectVolume);
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
