define(
  [
    'underscore',
    'dispatchers/Dispatcher',
    'stores/Store',
    'models/NullProject',
    'constants/NullProjectConstants',
    'constants/NullProjectInstanceConstants',
    'constants/NullProjectVolumeConstants'
  ],
  function (_, Dispatcher, Store, NullProject, NullProjectConstants, NullProjectInstanceConstants, NullProjectVolumeConstants) {

    var _project = null;
    var _isFetching = false;

    //
    // CRUD Operations
    //

    var fetchNullProject = function () {
      if(!_project && !_isFetching) {
        _isFetching = true;
        var project = new NullProject();
        project.fetch().done(function () {
          _isFetching = false;
          _project = project;
          NullProjectStore.emitChange();
        });
      }
    };

    function update(project){
      _project = project;
    }

    //
    // Project Instance Functions
    //

    function removeInstanceFromProject(instance, project){
      var indexOfInstance = project.get('instances').map(function(_instance){
        return _instance.alias;
      }).indexOf(instance.id);

      if(indexOfInstance < 0) throw new Error("Instance not in project");

      project.get('instances').splice(indexOfInstance, 1);
    }

    //
    // Project Volume Functions
    //

    function removeVolumeFromProject(volume, project){
      var indexOfVolume = project.get('volumes').map(function(_volume){
        return _volume.alias;
      }).indexOf(volume.id);

      if(indexOfVolume < 0) throw new Error("Volume not in project");

      project.get('volumes').splice(indexOfVolume, 1);
    }

    //
    // Project Store
    //

    var NullProjectStore = {

      get: function () {
        if(!_project) {
          fetchNullProject();
        } else {
          return _project;
        }
      }

    };

    Dispatcher.register(function (dispatch) {
      var actionType = dispatch.action.actionType;
      var payload = dispatch.action.payload;
      var options = dispatch.action.options || options;

      switch (actionType) {

        case NullProjectConstants.UPDATE_NULL_PROJECT:
          update(payload.project);
          break;

        case NullProjectInstanceConstants.REMOVE_INSTANCE_FROM_NULL_PROJECT:
          removeInstanceFromProject(payload.instance, payload.project);
          break;

        case NullProjectVolumeConstants.REMOVE_VOLUME_FROM_NULL_PROJECT:
          removeVolumeFromProject(payload.volume, payload.project);
          break;

        case NullProjectConstants.EMIT_NULL_PROJECT_CHANGE:
          break;

        default:
          return true;
      }

      if(!options.silent) {
        NullProjectStore.emitChange();
      }

      return true;
    });

    _.extend(NullProjectStore, Store);

    return NullProjectStore;
  });
