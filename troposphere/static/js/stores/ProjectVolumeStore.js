define(
  [
    'underscore',
    'dispatchers/Dispatcher',
    'stores/Store',
    'rsvp',
    'constants/ProjectVolumeConstants',
    'controllers/NotificationController',
    'models/Volume',
    'backbone',
    'globals'
  ],
  function (_, Dispatcher, Store, RSVP, ProjectVolumeConstants, NotificationController, Volume, Backbone, globals) {

    var _projectVolumes = {};
    var _isBeingFetched = {};

    //
    // CRUD Operations
    //

    function addVolumeToProject(volume, project){
      var projectVolume = new ProjectVolume({
        volume: volume,
        project: project
      });

      projectVolume.save().done(function(){
        var successMessage = "Volume '" + volume.get('name') + "' added to Project '" + project.get('name') + "'";
        //NotificationController.success(successMessage);
      }).fail(function(){
        var failureMessage = "Error adding Volume '" + volume.get('name') + "' to Project '" + project.get('name') + "'.";
        NotificationController.error(failureMessage);
        _projectVolumes[project.id].remove(volume);
      });
      _projectVolumes[project.id].add(volume);
    }

    function removeVolumeFromProject(volume, project){
      var projectVolume = new ProjectVolume({
        volume: volume,
        project: project
      });

      projectVolume.destroy().done(function(){
        var successMessage = "Volume '" + volume.get('name') + "' removed from Project '" + project.get('name') + "'";
        //NotificationController.success(successMessage);
      }).fail(function(){
        var failureMessage = "Error removing Volume '" + volume.get('name') + "' from Project '" + project.get('name') + "'.";
        NotificationController.error(failureMessage);
        _projectVolumes[project.id].add(volume);
      });
      _projectVolumes[project.id].remove(volume);
    }

    //
    // Project Volume Store
    //

    var ProjectVolumeStore = {

    };

    Dispatcher.register(function (payload) {
      var action = payload.action;

      switch (action.actionType) {
        case ProjectVolumeConstants.ADD_VOLUME_TO_PROJECT:
          addVolumeToProject(action.volume, action.project);
          break;

        case ProjectVolumeConstants.REMOVE_VOLUME_FROM_PROJECT:
          removeVolumeFromProject(action.volume, action.project);
          break;

        default:
          return true;
      }

      ProjectVolumeStore.emitChange();

      return true;
    });

    _.extend(ProjectVolumeStore, Store);

    return ProjectVolumeStore;
  });
