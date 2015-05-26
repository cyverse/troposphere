define(function (require) {
  'use strict';

  var _ = require('underscore'),
      Dispatcher = require('dispatchers/Dispatcher'),
      BaseStore = require('stores/BaseStore'),
      VolumeCollection = require('collections/VolumeCollection'),
      VolumeConstants = require('constants/VolumeConstants');

  var pollingFrequency = 15 * 1000;
  var _volumesBuilding = [];

  var VolumeStore = BaseStore.extend({
    collection: VolumeCollection,

    // todo: differences between this and base class implementation
    // page_size query param
    // pollNowUntilBuildIsFinished
    fetchModels: function () {
      if (!this.models && !this.isFetching) {
        this.isFetching = true;
        var models = new this.collection();
        models.fetch({
          url: models.url + "?page_size=100"
        }).done(function(){
          this.isFetching = false;
          this.models = models;
          this.models.each(this.pollNowUntilBuildIsFinished.bind(this));
          this.emitChange();
        }.bind(this));
      }
    },

    //
    // Custom functions
    //

    getVolumesOnProvider: function (provider) {
      if(!this.models) return this.fetchModels();

      var volumes = this.models.filter(function(volume){
        return volume.get('provider').id === provider.id;
      });

      return new VolumeCollection(volumes);
    },

    getVolumesAttachedToInstance: function (instance) {
      if(!this.models) return this.fetchModels();

      var attachedVolumes = [];
      this.models.each(function(volume){
        var attachData = volume.get('attach_data');
        if(attachData.instance_id && attachData.instance_id === instance.id){
          attachedVolumes.push(volume);
        }
      });
      return attachedVolumes;
    },

    getVolumesNotInAProject: function () {
      if(!this.models) return this.fetchModels();

      var volumes = this.models.filter(function(volume){
        return volume.get('projects').length === 0
      });

      return new VolumeCollection(volumes);
    },

    //
    // Polling functions
    //

    pollNowUntilBuildIsFinished: function(volume) {
      if (volume.id && _volumesBuilding.indexOf(volume) < 0) {
        _volumesBuilding.push(volume);
        this.fetchNowAndRemoveIfFinished(volume);
      }
    },

    pollUntilBuildIsFinished: function(volume) {
      if (volume.id && _volumesBuilding.indexOf(volume) < 0) {
        _volumesBuilding.push(volume);
        this.fetchAndRemoveIfFinished(volume);
      }
    },

    fetchAndRemoveIfFinished: function(volume) {
      setTimeout(function () {
        volume.fetchFromCloud(function() {
          this.update(volume);
          var index = _volumesBuilding.indexOf(volume);
          if (volume.get('state').isInFinalState()) {
            _volumesBuilding.splice(index, 1);
          } else {
            this.fetchAndRemoveIfFinished(volume);
          }
          this.emitChange();
        }.bind(this));
      }.bind(this), pollingFrequency);
    },

    fetchNowAndRemoveIfFinished: function(volume) {
      volume.fetchFromCloud(function () {
        this.update(volume);
        var index = _volumesBuilding.indexOf(volume);
        if (volume.get('state').isInFinalState()) {
          _volumesBuilding.splice(index, 1);
        } else {
          this.fetchAndRemoveIfFinished(volume);
        }
        this.emitChange();
      }.bind(this));
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
