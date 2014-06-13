define(
  [
    'underscore',
    'dispatchers/Dispatcher',
    'stores/Store',
    'rsvp',
    'collections/ProjectCollection',
    'constants/ProjectConstants',
    'controllers/NotificationController'
  ],
  function (_, Dispatcher, Store, RSVP, ProjectCollection, ProjectConstants, NotificationController) {

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
        NotificationController.success(successMessage);
        ProjectStore.emitChange();
      }).fail(function(){
        var failureMessage = "Error creating Project " + project.get('name') + " :( Please let Support know.";
        NotificationController.error(failureMessage);
        _projects.remove(project);
        ProjectStore.emitChange();
      });
      _projects.add(project);
    }

    function destroy(project){
      project.destroy().done(function(){
        var successMessage = "Project " + project.get('name') + " deleted.";
        NotificationController.success(successMessage);
        ProjectStore.emitChange();
      }).fail(function(){
        var failureMessage = "Error deleting Project " + project.get('name') + " :( Please let Support know.";
        NotificationController.error(failureMessage);
        _projects.add(project);
        ProjectStore.emitChange();
      });
      _projects.remove(project);
    }

    //
    // Project Store
    //

    var ProjectStore = {

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

        case ProjectConstants.PROJECT_DESTROY:
          destroy(action.model);
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
