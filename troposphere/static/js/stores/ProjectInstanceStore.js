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
    // Project Instance Model
    // Mainly a helper for generating add/remove urls
    //

    var ProjectInstance = Backbone.Model.extend({
      urlRoot: function() {
        return globals.API_ROOT + "/project/" + this.project.id + "/instance";
      },

      url: function () {
        var url = Backbone.Model.prototype.url.apply(this) + globals.slash();
        return url;
      },

      initialize: function(options){
        this.instance = options.instance;
        this.project = options.project;
        this.set("id", this.instance.id);
      }
    });

    var ProjectInstanceCollection = Backbone.Collection.extend({
      model: Instance,

      url: function () {
        var url = globals.API_ROOT + "/project/" + this.project.id + "/instance" + globals.slash();
        return url;
      },

      initialize: function(models, options){
        this.project = options.project;
      }
    });

    //
    // CRUD Operations
    //

    var fetchProjectInstances = function (project) {
      _isBeingFetched[project.id] = true;
      var promise = new RSVP.Promise(function (resolve, reject) {
        var projectInstances = new ProjectInstanceCollection(null, {
          project: project
        });
        projectInstances.fetch().done(function () {
          _isBeingFetched[project.id] = false;
          _projectInstances[project.id] = projectInstances;
          resolve();
        });
      });
      return promise;
    };

    function addInstanceToProject(instance, project){
      var projectInstance = new ProjectInstance({
        instance: instance,
        project: project
      });

      projectInstance.save().done(function(){
        var successMessage = "Instance '" + instance.get('name') + "' added to Project '" + project.get('name') + "'";
        NotificationController.success(successMessage);
      }).fail(function(){
        var failureMessage = "Error adding Instance '" + instance.get('name') + "' to Project '" + project.get('name') + "' :(  Please let Support know.";
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
        NotificationController.success(successMessage);
      }).fail(function(){
        var failureMessage = "Error adding Instance '" + instance.get('name') + "' to Project '" + project.get('name') + "' :(  Please let Support know.";
        NotificationController.error(failureMessage);
        _projectInstances[project.id].add(instance);
      });
      _projectInstances[project.id].remove(instance);
    }

    //
    // Project Instance Store
    //

    var ProjectInstanceStore = {

      getInstancesInProject: function (project) {
        var projectInstances = _projectInstances[project.id];
        var instancesAreBeingFetched = _isBeingFetched[project.id];

        // If there are no instances for the project, and the instances aren't being fetched
        // already, then go fetch them, otherwise return the instances we already have
        if(!projectInstances && !instancesAreBeingFetched) {
          fetchProjectInstances(project).then(function(){
            ProjectInstanceStore.emitChange();
          }.bind(this));
        }
        return projectInstances;
      }

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
