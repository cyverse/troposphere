define(function (require) {
  "use strict";

  var VolumeConstants = require('constants/VolumeConstants'),
      VolumeState = require('models/VolumeState'),
      InstanceVolumeActionRequest = require('models/InstanceVolumeActionRequest'),
      ModalHelpers = require('components/modals/ModalHelpers'),
      VolumeDetachModal = require('components/modals/volume/VolumeDetachModal.react'),
      Utils = require('../Utils'),
      stores = require('stores');

  return {

    detach: function (volume) {
      var modal = VolumeDetachModal({
        volume: volume
      });

      ModalHelpers.renderModal(modal, function () {
        var volumeState = new VolumeState({status_raw: "detaching"}),
            originalState = volume.get('state'),
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
        }).done(function(){
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
        }).fail(function(response){
          Utils.displayError({title: "Volume could not be detached", response: response});
          Utils.dispatch(VolumeConstants.POLL_VOLUME, {volume: volume});
        });
      })

    }

  };

});
