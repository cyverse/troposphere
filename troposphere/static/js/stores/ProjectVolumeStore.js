define(
  [
    'underscore',
    'dispatchers/Dispatcher',
    'stores/Store',
    'collections/ProjectVolumeCollection',
    'constants/ProjectVolumeConstants',
    'collections/VolumeCollection'
  ],
  function (_, Dispatcher, Store, Collection, Constants, VolumeCollection) {

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
            return pi.get('volume');
          });
          volumes = new VolumeCollection(volumes, {parse: true});

          _modelsFor[projectId] = volumes;
          ModelStore.emitChange();
        });
      }
    };


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

        //case Constants.ADD_INSTANCE_TO_PROJECT:
        //  addInstanceToProject(payload.instance, payload.project);
        //  break;
        //
        //case ProjectInstanceConstants.REMOVE_INSTANCE_FROM_PROJECT:
        //  removeInstanceFromProject(payload.instance, payload.project);
        //  break;

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
