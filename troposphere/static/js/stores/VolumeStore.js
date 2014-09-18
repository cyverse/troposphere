define(function (require) {
  'use strict';

  //
  // Dependencies
  // ------------
  //

  var _ = require('underscore'),
      Dispatcher = require('dispatchers/Dispatcher'),
      Store = require('stores/Store'),
      VolumeCollection = require('collections/VolumeCollection'),
      Volume = require('models/Volume'),
      VolumeConstants = require('constants/VolumeConstants'),
      NotificationController = require('controllers/NotificationController'),
      ProjectVolumeConstants = require('constants/ProjectVolumeConstants');

  //
  // Private variables
  //

  var _volumes = new VolumeCollection();
  var _isFetching = false;
  var validStates = ["available", "in-use", "error_deleting"];
  var pollingFrequency = 5 * 1000;
  var _pendingProjectVolumes = {};
  var _volumesBuilding = [];

  //
  // CRUD Operations
  //

  function add(volume) {
    _volumes.add(volume);
  }

  function update(volume) {
    var existingModel = _volumes.get(volume);
    if (!existingModel) throw new Error("Volume doesn't exist.");
    _volumes.add(volume, {merge: true});
  }

  function remove(volume) {
    _volumes.remove(volume);
  }

  function addPendingVolumeToProject(volume, project){
    _pendingProjectVolumes[project.id] = _pendingProjectVolumes[project.id] || new VolumeCollection();
    _pendingProjectVolumes[project.id].add(volume);
  }

  function removePendingVolumeFromProject(volume, project){
    _pendingProjectVolumes[project.id].remove(volume);
  }

  //
  // Polling functions
  //

  var pollNowUntilBuildIsFinished = function (volume) {
    if (volume.id && _volumesBuilding.indexOf(volume) < 0) {
      _volumesBuilding.push(volume);
      fetchNowAndRemoveIfFinished(volume);
    }
  };

  var fetchAndRemoveIfFinished = function (volume) {
    setTimeout(function () {
      volume.fetch().done(function () {
        var index = _volumesBuilding.indexOf(volume);
        if (validStates.indexOf(volume.get("status")) >= 0) {
          _volumesBuilding.splice(index, 1);
        } else {
          fetchAndRemoveIfFinished(volume);
        }
        VolumeStore.emitChange();
      });
    }, pollingFrequency);
  };

  var fetchNowAndRemoveIfFinished = function (volume) {
    volume.fetch().done(function () {
      var index = _volumesBuilding.indexOf(volume);
      if (volume.get('state').isInFinalState()) {
        _volumesBuilding.splice(index, 1);
      } else {
        fetchAndRemoveIfFinished(volume);
      }
      VolumeStore.emitChange();
    });
  };

  //
  // Volume Store
  //

  var VolumeStore = {

    getAll: function (projects) {
      if (!projects) throw new Error("Must supply projects");

      projects.each(function (project) {
        this.getVolumesInProject(project);
      }.bind(this));

      return _volumes;
    },

    getVolumeInProject: function (project, volumeId) {
      var volumes = this.getVolumesInProject(project);
      var volume = volumes.get(volumeId);
      if (!volume) {
        NotificationController.error("Volume not in project", "The volume could not be found in the project");
      }
      return volume;
    },

    getVolumesInProject: function (project) {

      var projectVolumeArray = project.get('volumes').map(function (volumeData) {
        // todo: we're converting into a volume object here so we can use
        // id instead of alias for consistency. Eventually all alias attributes
        // need to be renamed id and then we can create the object only if
        // the id isn't in the existing map.
        var volume = new Volume(volumeData, {parse: true});
        var existingVolume = _volumes.get(volume);

        if (existingVolume) {
          volume = existingVolume;
        } else {
          _volumes.push(volume);
          pollNowUntilBuildIsFinished(volume);
        }

        return volume;
      });

      // Add any pending volumes to the result set
      var pendingProjectVolumes = _pendingProjectVolumes[project.id];
      if(pendingProjectVolumes){
        projectVolumeArray = projectVolumeArray.concat(pendingProjectVolumes.models);
      }

      return new VolumeCollection(projectVolumeArray);
    },

    getVolumesAttachedToInstance: function (instance) {
      var attachedVolumes = [];
      _volumes.each(function(volume){
        var attachData = volume.get('attach_data');
        if(attachData.instance_id && attachData.instance_id === instance.id){
          attachedVolumes.push(volume);
        }
      });
      return attachedVolumes;
    }

  };

  Dispatcher.register(function (dispatch) {
    var actionType = dispatch.action.actionType;
    var payload = dispatch.action.payload;
    var options = dispatch.action.options || options;

    switch (actionType) {

      case VolumeConstants.ADD_VOLUME:
        add(payload.volume);
        break;

      case VolumeConstants.UPDATE_VOLUME:
        update(payload.volume);
        break;

      case VolumeConstants.REMOVE_VOLUME:
        remove(payload.volume);
        break;

      case VolumeConstants.POLL_VOLUME:
        pollNowUntilBuildIsFinished(payload.volume);
        break;

      case ProjectVolumeConstants.ADD_PENDING_VOLUME_TO_PROJECT:
        addPendingVolumeToProject(payload.volume, payload.project);
        break;

      case ProjectVolumeConstants.REMOVE_PENDING_VOLUME_FROM_PROJECT:
        removePendingVolumeFromProject(payload.volume, payload.project);
        break;

      default:
        return true;
    }

    if (!options.silent) {
      VolumeStore.emitChange();
    }

    return true;
  });

  _.extend(VolumeStore, Store);

  return VolumeStore;
});
