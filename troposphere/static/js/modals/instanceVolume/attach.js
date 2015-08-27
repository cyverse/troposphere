define(function (require) {
  "use strict";

  var ModalHelpers = require('components/modals/ModalHelpers'),
    VolumeAttachModal = require('components/modals/volume/VolumeAttachModal.react'),
    actions = require('actions');

  return {

    attach: function(volume, project) {
      ModalHelpers.renderModal(
          // Modal to create
          VolumeAttachModal, 

          // Modal properties
          {
              volume: volume,
              project: project
          }, 

          // This callback is the action fired in the modal
          function (instance, mountLocation) {
            actions.InstanceVolumeActions.attach({
              instance: instance,
              volume: volume,
              project: project,
              mountLocation: mountLocation
            })
          }
      )
    }

  };

});
