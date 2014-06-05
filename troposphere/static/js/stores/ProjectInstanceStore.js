define(
  [
    'underscore',
    'dispatchers/dispatcher',
    'stores/store',
    'rsvp',
    'constants/ProjectInstanceConstants',
    'controllers/notifications',
    'models/instance',
    'backbone',
    'globals'
  ],
  function (_, Dispatcher, Store, RSVP, ProjectInstanceConstants, NotificationController, Instance, Backbone, globals) {

    var _projectInstances = {};
    var _isFetching = false;

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
      _isFetching = true;
      var promise = new RSVP.Promise(function (resolve, reject) {
        var projectInstances = new ProjectInstanceCollection(null, {
          project: project
        });
        projectInstances.fetch().done(function () {
          _isFetching = false;
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
        NotificationController.success('instance added to project!');
      }).fail(function(){
        NotificationController.danger("problem adding instance to project, removing item :(");
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
        NotificationController.success('item removed from project!');
      }).fail(function(){
        NotificationController.danger("problem removing item from project, adding item back :(");
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
        if(!projectInstances) {
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
