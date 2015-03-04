define(function (require) {

  var _ = require('underscore'),
      Dispatcher = require('dispatchers/Dispatcher'),
      Store = require('stores/Store'),
      Collection = require('collections/ProjectVolumeCollection'),
      Constants = require('constants/ProjectVolumeConstants'),
      VolumeCollection = require('collections/VolumeCollection'),
      Volume = require('models/Volume');

  var _models = null;
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

        // convert ProjectInstance collection to an InstanceCollection
        var volumes = models.map(function(pi){
          return new Volume(pi.get('volume'), {parse: true});
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
        fetchModels()
      }
      return _models;
    },

    getVolumesFor: function(project){
      if(!_modelsFor[project.id]) {
        fetchModelsFor(project.id);
      } else {
        return _modelsFor[project.id];
      }
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
