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
    pollUntilBuildIsFinished(volume);
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

  var _volumesBuilding = [];
  var pollUntilBuildIsFinished = function (volume) {
    //return;
    if (volume.id) {
      _volumesBuilding.push(volume);
      fetchAndRemoveIfFinished(volume);
    }
  };

  var fetchAndRemoveIfFinished = function (volume) {
    //return;
    setTimeout(function () {
      volume.fetch().done(function () {
        var index = _volumesBuilding.indexOf(volume);
        if (validStates.indexOf(volume.get("status")) >= 0) {
          _volumesBuilding.slice(index, 1);
        } else {
          fetchAndRemoveIfFinished(volume);
        }
        VolumeStore.emitChange();
      });
    }, pollingFrequency);
  };

  // The pollNow functions poll immediately and then cycle
  // as opposed to waiting for the delay and THEN polling
  var pollNowUntilBuildIsFinished = function (volume) {
    //return;
    if (volume.id && _volumesBuilding.indexOf(volume) < 0) {
      _volumesBuilding.push(volume);
      fetchNowAndRemoveIfFinished(volume);
    }
  };

  var fetchNowAndRemoveIfFinished = function (volume) {
    //return;
    volume.fetch().done(function () {
      var index = _volumesBuilding.indexOf(volume);
      if (volume.get('state').isInFinalState()) {
        _volumesBuilding.slice(index, 1);
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
