define(
  [
    'underscore',
    'dispatchers/dispatcher',
    'stores/Store',
    'rsvp',
    'collections/projects',
    'constants/ProjectConstants',
    'controllers/notifications'
  ],
  function (_, Dispatcher, Store, RSVP, Projects, ProjectConstants, NotificationController) {

    var _projects = null;
    var _isFetching = false;

    //
    // CRUD Operations
    //

    var fetchProjects = function () {
      _isFetching = true;
      var promise = new RSVP.Promise(function (resolve, reject) {
        var projects = new Projects();
        projects.fetch().done(function () {
          _isFetching = false;
          _projects = projects;
          resolve();
        });
      });
      return promise;
    };

    function create(project){
      project.save().done(function(){
        var successMessage = "Project " + project.get('name') + " created.";
        NotificationController.success(successMessage);
      }).fail(function(){
        var failureMessage = "Error creating Project " + project.get('name') + " :( Please let Support know.";
        NotificationController.danger(failureMessage);
        _projects.remove(project);
      });
      _projects.add(project);
    }

    function destroy(project){
      project.destroy().done(function(){
        var successMessage = "Project " + project.get('name') + " deleted.";
        NotificationController.success(successMessage);
      }).fail(function(){
        var failureMessage = "Error deleting Project " + project.get('name') + " :( Please let Support know.";
        NotificationController.danger(failureMessage);
        _projects.add(project);
      });
      _projects.remove(project);
    }

    //
    // Project Store
    //

    var ProjectStore = {

      getAll: function () {
        if(!_projects && !_isFetching) {
          fetchProjects().then(function(){
            ProjectStore.emitChange();
          }.bind(this));
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
