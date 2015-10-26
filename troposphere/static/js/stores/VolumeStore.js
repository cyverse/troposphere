define(function (require) {
  'use strict';

  var _ = require('underscore'),
    Dispatcher = require('dispatchers/Dispatcher'),
    BaseStore = require('stores/BaseStore'),
    VolumeCollection = require('collections/VolumeCollection'),
    VolumeConstants = require('constants/VolumeConstants');

  var VolumeStore = BaseStore.extend({
    collection: VolumeCollection,

    queryParams: {
      page_size: 100
    },

    initialize: function () {
      this.pollingEnabled = true;
      this.pollingFrequency = 15 * 1000;
    },

    //
    // Custom functions
    //

    getVolumesAttachedToInstance: function (instance) {
      if (!this.models) return this.fetchModels();

      var attachedVolumes = [],
          uuid = instance.get('uuid');

      this.models.each(function (volume) {
        var attachData = volume.get('attach_data');
        if (attachData.instance_id && attachData.instance_id === uuid) {
          attachedVolumes.push(volume);
        }
      });
      return attachedVolumes;
    },

// Makes a clean list of attached resources from volume information for easy reference
    getAttachedResources: function () {
        if (!this.models) return this.fetchModels();
        var attachedResources = [];
        this.models.each(function (volume) {
            var attachData = volume.get('attach_data');
            if (attachData && attachData.instance_id) {
                attachedResources.push(volume.get('uuid'));
                attachedResources.push(attachData.instance_id);
            }
        });
        return attachedResources;
    },


    getVolumesNotInAProject: function () {
      if (!this.models) return this.fetchModels();

      var volumes = this.models.filter(function (volume) {
        return volume.get('projects').length === 0
      });

      return new VolumeCollection(volumes);
    },

    //
    // Polling functions
    //

    isInFinalState: function (volume) {
      return volume.get('state').isInFinalState();
    }

  });

  var store = new VolumeStore();

  Dispatcher.register(function (dispatch) {
    var actionType = dispatch.action.actionType;
    var payload = dispatch.action.payload;
    var options = dispatch.action.options || options;

    switch (actionType) {

      case VolumeConstants.ADD_VOLUME:
        store.add(payload.volume);
        break;

      case VolumeConstants.UPDATE_VOLUME:
        store.update(payload.volume);
        break;

      case VolumeConstants.REMOVE_VOLUME:
        store.remove(payload.volume);
        break;

      case VolumeConstants.POLL_VOLUME:
        store.pollNowUntilBuildIsFinished(payload.volume);
        break;

      case VolumeConstants.POLL_VOLUME_WITH_DELAY:
        store.pollUntilBuildIsFinished(payload.volume);
        break;

      default:
        return true;
    }

    if (!options.silent) {
      store.emitChange();
    }

    return true;
  });

  return store;
});
