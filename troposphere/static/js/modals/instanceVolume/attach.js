define(function (require) {
  "use strict";

  var ModalHelpers = require('components/modals/ModalHelpers'),
      VolumeAttachModal = require('components/modals/volume/VolumeAttachModal.react'),
      actions = require('actions');

  return {

    attach: function(volume, project){
      var props = {
        volume: volume,
        project: project
      };

      ModalHelpers.renderModal(VolumeAttachModal, props, function (instance, mountLocation) {
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
