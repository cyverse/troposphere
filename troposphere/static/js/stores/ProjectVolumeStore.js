define(
  [
    'underscore',
    'dispatchers/dispatcher',
    'stores/store',
    'rsvp',
    'constants/ProjectVolumeConstants',
    'controllers/notifications',
    'models/volume',
    'backbone',
    'globals'
  ],
  function (_, Dispatcher, Store, RSVP, ProjectVolumeConstants, NotificationController, Volume, Backbone, globals) {

    var _projectVolumes = {};
    var _isFetching = false;

    //
    // Project Volume Model
    // Mainly a helper for generating add/remove urls
    //

    var ProjectVolume = Backbone.Model.extend({
      urlRoot: function() {
        return globals.API_ROOT + "/project/" + this.project.id + "/volume";
      },

      url: function () {
        var url = Backbone.Model.prototype.url.apply(this) + globals.slash();
        return url;
      },

      initialize: function(options){
        this.volume = options.volume;
        this.project = options.project;
        this.set("id", this.volume.id);
      }
    });

    var ProjectVolumeCollection = Backbone.Collection.extend({
      model: Volume,

      url: function () {
        var url = globals.API_ROOT + "/project/" + this.project.id + "/volume" + globals.slash();
        return url;
      },

      initialize: function(models, options){
        this.project = options.project;
      }
    });

    //
    // CRUD Operations
    //

    var fetchProjectVolumes = function (project) {
      _isFetching = true;
      var promise = new RSVP.Promise(function (resolve, reject) {
        var projectVolumes = new ProjectVolumeCollection(null, {
          project: project
        });
        projectVolumes.fetch().done(function () {
          _isFetching = false;
          _projectVolumes[project.id] = projectVolumes;
          resolve();
        });
      });
      return promise;
    };

    function addVolumeToProject(volume, project){
      var projectVolume = new ProjectVolume({
        volume: volume,
        project: project
      });

      projectVolume.save().done(function(){
        var successMessage = "Volume '" + volume.get('name') + "' added to Project '" + project.get('name') + "'";
        NotificationController.success(successMessage);
      }).fail(function(){
        var failureMessage = "Error adding Volume '" + volume.get('name') + "' to Project '" + project.get('name') + "' :(  Please let Support know.";
        NotificationController.danger(failureMessage);
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
        NotificationController.success(successMessage);
      }).fail(function(){
        var failureMessage = "Error removing Volume '" + volume.get('name') + "' from Project '" + project.get('name') + "' :(  Please let Support know.";
        NotificationController.danger(failureMessage);
        _projectVolumes[project.id].add(volume);
      });
      _projectVolumes[project.id].remove(volume);
    }

    //
    // Project Volume Store
    //

    var ProjectVolumeStore = {

      getVolumesInProject: function (project) {
        var projectVolumes = _projectVolumes[project.id];
        if(!projectVolumes) {
          fetchProjectVolumes(project).then(function(){
            ProjectVolumeStore.emitChange();
          }.bind(this));
        }
        return projectVolumes;
      }

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
