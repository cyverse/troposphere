define(function (require) {

  var VolumeConstants = require('constants/VolumeConstants'),
      VolumeState = require('models/VolumeState'),
      stores = require('stores'),
      Utils = require('../Utils'),
      globals = require('globals'),
      ProjectVolumeConstants = require('constants/ProjectVolumeConstants');

  return {

    destroy: function(payload, options){
      var volume = payload.volume,
          project = payload.project,
          volumeState = new VolumeState({status_raw: "deleting"}),
          originalState = volume.get('state'),
          identity = volume.get('identity'),
          provider = volume.get('provider'),
          url = (
            globals.API_ROOT +
            "/provider/" + provider.uuid +
            "/identity/" + identity.uuid +
            "/volume/"   + volume.get('uuid')
          );

      volume.set({state: volumeState});
      Utils.dispatch(VolumeConstants.UPDATE_VOLUME, {volume: volume});

      volume.destroy({
        url: url
      }).done(function () {
        var projectVolume = stores.ProjectVolumeStore.findOne({
          'project.id': project.id,
          'volume.id': volume.id
        });
        // todo: the proper thing to do is to poll until the volume is actually destroyed
        // and THEN remove it from the project. Need to find a way to support that.
        Utils.dispatch(VolumeConstants.REMOVE_VOLUME, {volume: volume});
        Utils.dispatch(ProjectVolumeConstants.REMOVE_PROJECT_VOLUME, {projectVolume: projectVolume}, options);
      }).fail(function (response) {
        volume.set({state: originalState});
        Utils.dispatch(VolumeConstants.UPDATE_VOLUME, {volume: volume});
        Utils.dispatch(VolumeConstants.POLL_VOLUME, {volume: volume});
        Utils.displayError({title: "Your volume could not be deleted", response: response});
      });
    },

    destroy_noModal: function(payload, options){
      this.destroy(payload, options);
    }
  };

});
