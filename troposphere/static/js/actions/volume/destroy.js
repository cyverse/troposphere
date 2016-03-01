
import VolumeConstants from 'constants/VolumeConstants';
import VolumeState from 'models/VolumeState';
import stores from 'stores';
import Utils from '../Utils';
import globals from 'globals';
import ProjectVolumeConstants from 'constants/ProjectVolumeConstants';

export default {

    destroy: function (payload, options) {
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
          "/volume/" + volume.get('uuid')
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
};
