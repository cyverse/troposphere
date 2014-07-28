define(
  [
    'underscore',
    'dispatchers/Dispatcher',
    'stores/Store',
    'rsvp',
    'constants/ProjectInstanceConstants',
    'controllers/NotificationController',
    'models/Instance',
    'backbone',
    'globals'
  ],
  function (_, Dispatcher, Store, RSVP, ProjectInstanceConstants, NotificationController, Instance, Backbone, globals) {

    var _projectInstances = {};
    var _isBeingFetched = {};

    //
    // CRUD Operations
    //

    function addInstanceToProject(instance, project){
      var projectInstance = new ProjectInstance({
        instance: instance,
        project: project
      });

      projectInstance.save().done(function(){
        var successMessage = "Instance '" + instance.get('name') + "' added to Project '" + project.get('name') + "'";
        //NotificationController.success(successMessage);
      }).fail(function(){
        var failureMessage = "Error adding Instance '" + instance.get('name') + "' to Project '" + project.get('name') + "'.";
        NotificationController.error(failureMessage);
        _projectInstances[project.id].remove(instance);
      });
      _projectInstances[project.id].add(instance);
    }

    function removeInstanceFromProject(instance, project){
      var projectInstance = new ProjectInstance({
        instance: instance,
        project: project
      });

      projectInstance.destroy().done(function(){
        var successMessage = "Instance '" + instance.get('name') + "' removed from Project '" + project.get('name') + "'";
        //NotificationController.success(successMessage);
      }).fail(function(){
        var failureMessage = "Error removing Instance '" + instance.get('name') + "' from Project '" + project.get('name') + "'.";
        NotificationController.error(failureMessage);
        _projectInstances[project.id].add(instance);
      });
      _projectInstances[project.id].remove(instance);
    }

    //
    // Project Instance Store
    //

    var ProjectInstanceStore = {

    };

    Dispatcher.register(function (payload) {
      var action = payload.action;

      switch (action.actionType) {
        case ProjectInstanceConstants.ADD_INSTANCE_TO_PROJECT:
          addInstanceToProject(action.instance, action.project);
          break;

        case ProjectInstanceConstants.REMOVE_INSTANCE_FROM_PROJECT:
          removeInstanceFromProject(action.instance, action.project);
          break;

        default:
          return true;
      }

      ProjectInstanceStore.emitChange();

      return true;
    });

    _.extend(ProjectInstanceStore, Store);

    return ProjectInstanceStore;
  });
