define(function (require) {
  "use strict";

  var ModalHelpers = require('components/modals/ModalHelpers'),
      VolumeAttachModal = require('components/modals/volume/VolumeAttachModal.react'),
      actions = require('actions');

  return {

    attach: function(volume, project){
      var modal = VolumeAttachModal({
        volume: volume,
        project: project
      });

      ModalHelpers.renderModal(modal, function (instance, mountLocation) {
        actions.InstanceVolumeActions.attach({
          instance: instance,
          volume: volume,
          project: project,
          mountLocation: mountLocation
        })
      })

    }

  };

});
