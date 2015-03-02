define(function (require) {
  'use strict';

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

  var _models = null;
  var _isFetching = false;

  var pollingFrequency = 15 * 1000;
  var _volumesBuilding = [];

  //
  // CRUD Operations
  //

  var fetchModels = function () {
    if(!_models && !_isFetching) {
      _isFetching = true;
      var models = new VolumeCollection();
      models.fetch({
        url: models.url + "?page_size=100"
      }).done(function () {
        _isFetching = false;
        _models = models;
        ModelStore.emitChange();
      });
    }
  };

  function add(volume) {
    _models.add(volume);
  }

  function update(model) {
    var existingModel = _models.get(model);
    if (!existingModel) throw new Error("Volume doesn't exist.");
    _models.add(model, {merge: true});
  }

  function remove(model) {
    _models.remove(model);
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

  var pollUntilBuildIsFinished = function (volume) {
    if (volume.id && _volumesBuilding.indexOf(volume) < 0) {
      _volumesBuilding.push(volume);
      fetchAndRemoveIfFinished(volume);
    }
  };

  var fetchAndRemoveIfFinished = function (volume) {
    setTimeout(function () {
      volume.fetch().done(function () {
        var index = _volumesBuilding.indexOf(volume);
        if (volume.get('state').isInFinalState()) {
          _volumesBuilding.splice(index, 1);
        } else {
          fetchAndRemoveIfFinished(volume);
        }
        ModelStore.emitChange();
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
      ModelStore.emitChange();
    });
  };

  //
  // Volume Store
  //

  var ModelStore = {

    getAll: function () {
      if(!_models) {
        fetchModels()
      }
      return _models;
    },

    get: function (modelId) {
      if(!_models) {
        fetchModels();
      } else {
        return _models.get(modelId);
      }
    },

    getVolumesOnProvider: function (provider) {
      if(!_models) return fetchModels();

      var volumes = _models.filter(function(volume){
        return volume.get('provider').id === provider.id;
      });

      return new VolumeCollection(volumes);
    },

    getVolumesAttachedToInstance: function (instance) {
      if(!_models) return fetchModels();

      var attachedVolumes = [];
      _models.each(function(volume){
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

      case VolumeConstants.POLL_VOLUME_WITH_DELAY:
        pollUntilBuildIsFinished(payload.volume);
        break;

      default:
        return true;
    }

    if (!options.silent) {
      ModelStore.emitChange();
    }

    return true;
  });

  _.extend(ModelStore, Store);

  return ModelStore;
});
