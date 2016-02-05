define(function (require) {
  'use strict';

  var _ = require('underscore'),
    Utils = require('actions/Utils'),
    Dispatcher = require('dispatchers/Dispatcher'),
    BaseStore = require('stores/BaseStore'),
    VolumeCollection = require('collections/VolumeCollection'),
    VolumeConstants = require('constants/VolumeConstants'),
    VolumeState = require('models/VolumeState');

  var VolumeStore = BaseStore.extend({
    collection: VolumeCollection,

    queryParams: {
      page_size: 100
    },

    initialize: function () {
      this.pollingEnabled = true;
      this.pollingFrequency = 10 * 1000;
    },

    //
    // Custom functions
    //

    getVolumesAttachedToInstance: function (instance) {
      if (!this.models) return this.fetchModels();

      var uuid = instance.get('uuid');

      var attachedVolumes = this.models.filter(function (volume) {
          var attachData = volume.get('attach_data');
          return attachData.instance_id && attachData.instance_id === uuid;
      });

      return new VolumeCollection(attachedVolumes);
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
    },

    // Poll for a model
    pollUntilDetached: function(volume) {
        this.pollWhile(volume, function(model, response) {
            var status = volume.get('state').get("status");
            var responseIs200 = String(response.status)[0] == "2";

            var keepPolling = status != "available" && responseIs200;

            if (keepPolling) {
                volume.set({
                    state: new VolumeState({
                        status_raw: "detaching"
                    }),
                });
            }
            Utils.dispatch(VolumeConstants.UPDATE_VOLUME, {volume: volume});

            return keepPolling;
        }.bind(this));
    },

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
