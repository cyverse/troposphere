define(
  [
    'underscore',
    'dispatchers/Dispatcher',
    'stores/Store',
    'collections/ProjectCollection',
    'constants/ProjectConstants',
    'controllers/NotificationController',
    'constants/ProjectInstanceConstants',
    './helpers/ProjectInstance',
    'constants/ProjectVolumeConstants',
    './helpers/ProjectVolume'
  ],
  function (_, Dispatcher, Store, ProjectCollection, ProjectConstants, NotificationController, ProjectInstanceConstants, ProjectInstance, ProjectVolumeConstants, ProjectVolume) {

    var _projects = null;
    var _isFetching = false;
    var _shouldDoubleCheckIfProjectApiFunctionsAsExpected = false;

    //
    // CRUD Operations
    //

    var fetchProjects = function () {
      if(!_projects && !_isFetching) {
        _isFetching = true;
        var projects = new ProjectCollection();
        projects.fetch().done(function () {
          _isFetching = false;
          _projects = projects;
          ProjectStore.emitChange();
        });
      }
    };

    function create(project){
      project.save().done(function(){
        var successMessage = "Project " + project.get('name') + " created.";
        //NotificationController.success(successMessage);
        ProjectStore.emitChange();
      }).fail(function(){
        var failureMessage = "Error creating Project " + project.get('name') + ".";
        NotificationController.error(failureMessage);
        _projects.remove(project);
        ProjectStore.emitChange();
      });
      _projects.add(project);
    }

    function update(project){
      project.save().done(function(){
        var successMessage = "Project " + project.get('name') + " updated.";
        //NotificationController.success(successMessage);
        ProjectStore.emitChange();
      }).fail(function(){
        var failureMessage = "Error updating Project " + project.get('name') + ".";
        NotificationController.error(failureMessage);
        ProjectStore.emitChange();
      });
    }

    function destroy(project){
      project.destroy().done(function(){
        var successMessage = "Project " + project.get('name') + " deleted.";
        //NotificationController.success(successMessage);
        ProjectStore.emitChange();
      }).fail(function(){
        var failureMessage = "Error deleting Project " + project.get('name') + ".";
        NotificationController.error(failureMessage);
        _projects.add(project);
        ProjectStore.emitChange();
      });
      _projects.remove(project);
    }

    function add(project){
      _projects.add(project);
    }

    function update(project){
      var existingModel = _projects.get(project);
      if(!existingModel) throw new Error("Project doesn't exist.");
      _projects.add(project, {merge: true});
    }

    function remove(project){
      _projects.remove(project);
    }

    //
    // Project Instance Functions
    //

    function addInstanceToProject(instance, project){
      project.get('instances').push(instance.toJSON());
    }

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

    function addVolumeToProject(volume, project){
      project.get('volumes').push(volume.toJSON());
    }

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

    var ProjectStore = {

      get: function (projectId) {
        if(!_projects) {
          fetchProjects();
        } else {
          return _projects.get(projectId);
        }
      },

      getAll: function () {
        if(!_projects) {
          fetchProjects()
        }
        return _projects;
      }

    };

    Dispatcher.register(function (dispatch) {
      var actionType = dispatch.action.actionType;
      var payload = dispatch.action.payload;
      var options = dispatch.action.options || options;

      switch (actionType) {
        // case ProjectConstants.PROJECT_CREATE:
        //   create(action.model);
        //   break;

        // case ProjectConstants.PROJECT_UPDATE:
        //   update(action.model);
        //   break;

        // case ProjectConstants.PROJECT_DESTROY:
        //   destroy(action.model);
        //   break;

        case ProjectConstants.ADD_PROJECT:
          add(payload.project);
          break;

        case ProjectConstants.UPDATE_PROJECT:
          update(payload.project);
          break;

        case ProjectConstants.REMOVE_PROJECT:
          remove(payload.project);
          break;

        case ProjectInstanceConstants.ADD_INSTANCE_TO_PROJECT:
          addInstanceToProject(payload.instance, payload.project);
          break;

        case ProjectInstanceConstants.REMOVE_INSTANCE_FROM_PROJECT:
          removeInstanceFromProject(payload.instance, payload.project);
          break;

        case ProjectVolumeConstants.ADD_VOLUME_TO_PROJECT:
          addVolumeToProject(payload.volume, payload.project);
          break;

        case ProjectVolumeConstants.REMOVE_VOLUME_FROM_PROJECT:
          removeVolumeFromProject(payload.volume, payload.project);
          break;

        case ProjectConstants.EMIT_CHANGE:
          break;

        default:
          return true;
      }

      if(!options.silent) {
        ProjectStore.emitChange();
      }

      return true;
    });

    _.extend(ProjectStore, Store);

    return ProjectStore;
  });
