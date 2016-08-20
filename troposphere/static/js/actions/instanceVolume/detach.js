
import VolumeConstants from 'constants/VolumeConstants';
import VolumeState from 'models/VolumeState';
import InstanceVolumeActionRequest from 'models/InstanceVolumeActionRequest';
import Utils from '../Utils';
import stores from 'stores';

export default {

    detach: function (params) {
      if (!params.volume) throw new Error("Missing volume");

      var volume = params.volume,
        volumeState = new VolumeState({status_raw: "detaching"}),
        instanceUUID = volume.get('attach_data').instance_id,
        instance = stores.InstanceStore.getAll().findWhere({uuid: instanceUUID}),
        actionRequest = new InstanceVolumeActionRequest({
          instance: instance,
          volume: volume
        });

      volume.set({state: volumeState});
      Utils.dispatch(VolumeConstants.UPDATE_VOLUME, {volume: volume});

      actionRequest.save(null, {
        attrs: {
          action: "detach_volume",
          volume_id: volume.get('uuid')
        }
      }).done(function () {
        // todo: volume detach happens quickly once the cloud gets the request. The problem is that
        // at this moment, all that's happened is that the *request* to detach has been received. If
        // we tell the user the volume was detached, we're lying - it hasn't been.
        // NotificationController.success(
        //  "Volume Detached",
        //  "Volume was detached.  It is now available to attach to another instance or destroy."
        // );

        volume.set('state', volumeState);
        Utils.dispatch(VolumeConstants.UPDATE_VOLUME, {volume: volume});
        Utils.dispatch(VolumeConstants.POLL_VOLUME_WITH_DELAY, {volume: volume});
      }).fail(function (response) {
        Utils.displayError({title: "Volume could not be detached", response: response});
        Utils.dispatch(VolumeConstants.POLL_VOLUME, {volume: volume});
      });

    }

  };
