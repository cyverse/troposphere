import VolumeConstants from 'constants/VolumeConstants';
import VolumeState from 'models/VolumeState';
import actions from 'actions';
import Badges from 'Badges';
import globals from 'globals';
import InstanceVolumeActionRequest from 'models/InstanceVolumeActionRequest';
import Utils from '../Utils';
import NotificationController from 'controllers/NotificationController';
import VolumeAttachNotifications from 'components/notifications/VolumeAttachNotifications.react';


export default {

    attach: function (params) {
      if (!params.instance) throw new Error("Missing instance");
      if (!params.volume) throw new Error("Missing volume");

      var instance = params.instance,
        mountLocation = params.mountLocation,
        volume = params.volume,
        helpLink = params.helpLink;

      var volumeState = new VolumeState({status_raw: "attaching"}),
        originalState = volume.get('state'),
        actionRequest = new InstanceVolumeActionRequest({
          instance: instance,
          volume: volume
        });

      volume.set({state: volumeState});
      Utils.dispatch(VolumeConstants.UPDATE_VOLUME, {volume: volume});

      actionRequest.save(null, {
        attrs: {
          action: "attach_volume",
          volume_id: volume.get('uuid'),
          mount_location: mountLocation
        }
      }).done(function () {
        // todo: volume attach happens quickly once the cloud gets the request. The problem is that
        // at this moment, all that's happened is that the *request* to attach has been received. If
        // we tell the user the volume was attached, we're lying - it hasn't been.
        // NotificationController.success("Volume Attached",
        //                                VolumeAttachNotifications.success(helpLink));

        Utils.dispatch(VolumeConstants.UPDATE_VOLUME, {volume: volume});
        Utils.dispatch(VolumeConstants.POLL_VOLUME_WITH_DELAY, {volume: volume});
        if(globals.BADGES_ENABLED){
          actions.BadgeActions.checkOrGrant(Badges.ATTACH_VOLUME_BADGE);
        }
      }).fail(function (response) {
        var title = "Error attaching volume",
          message,
          error;

        try {
          error = response.responseJSON.errors[0];
          if (error.code === 409) {
            message = VolumeAttachNotifications.attachError(
                volume,
                instance,
                helpLink);
            NotificationController.error(title, message);
          } else {
            NotificationController.error(
              title,
              error.code + ": " + error.message
            );
          }
        }
        catch (err) {
          NotificationController.error(
            title,
            "If the problem persists, please contact support."
          );
        }

        // poll the volume to get it's real status
        Utils.dispatch(VolumeConstants.POLL_VOLUME, {volume: volume});
      });


    }

  };
