define(
  [
    'underscore',
    'dispatchers/Dispatcher',
    'stores/Store',
    'rsvp',
    'collections/ProjectCollection',
    'constants/ProjectConstants',
    'controllers/NotificationController',
    'models/Volume',
    'actions/ProjectActions',
    'stores/VolumeStore'
  ],
  function (_, Dispatcher, Store, RSVP, ProjectCollection, ProjectConstants, NotificationController, Volume, ProjectActions, VolumeStore) {

    var _projects = null;
    var _isFetching = false;

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

    function createVolumeAndAddToProject(project, volumeParams){
      var identity = volumeParams.identity;
      var volumeName = volumeParams.volumeName;
      var volumeSize = volumeParams.volumeSize;

      var volume = new Volume({
        identity: {
          id: identity.id,
          provider: identity.get('provider_id')
        },
        name: volumeName,
        description: "",
        size: volumeSize
      });

      var params = {
        model_name: "volume"
      };

      volume.save(params, {
        success: function (model) {
          NotificationController.success(null, 'Step 1 (create volume) completed.');

          // add volume to project
          // force volumes to fetch
          ProjectActions.addItemToProject(project, volume);
          VolumeStore.fetchAll();
        },
        error: function (response) {
          NotificationController.error(null, 'Step 1 (create volume) failed.');
        }
      });
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

    Dispatcher.register(function (payload) {
      var action = payload.action;

      switch (action.actionType) {
        case ProjectConstants.PROJECT_CREATE:
          create(action.model);
          break;

        case ProjectConstants.PROJECT_UPDATE:
          update(action.model);
          break;

        case ProjectConstants.PROJECT_DESTROY:
          destroy(action.model);
          break;

        case ProjectConstants.PROJECT_CREATE_VOLUME_AND_ADD_TO_PROJECT:
          createVolumeAndAddToProject(action.project, action.volumeParams);
          break;

        default:
          return true;
      }

      ProjectStore.emitChange();

      return true;
    });

    _.extend(ProjectStore, Store);

    return ProjectStore;
  });
