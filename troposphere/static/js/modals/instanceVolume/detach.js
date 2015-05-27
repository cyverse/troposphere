define(function (require) {
  "use strict";

  var actions = require('actions'),
      ModalHelpers = require('components/modals/ModalHelpers'),
      VolumeDetachModal = require('components/modals/volume/VolumeDetachModal.react');

  return {

    detach: function (volume) {
      var modal = VolumeDetachModal({
        volume: volume
      });

      ModalHelpers.renderModal(modal, function () {
        actions.InstanceVolumeActions.detach({
          volume: volume
        })
      })

    }

  };

});
