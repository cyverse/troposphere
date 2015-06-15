define(function (require) {
  "use strict";

  var actions = require('actions'),
      ModalHelpers = require('components/modals/ModalHelpers'),
      VolumeDetachModal = require('components/modals/volume/VolumeDetachModal.react');

  return {

    detach: function (volume) {
      var props = {
        volume: volume
      };

      ModalHelpers.renderModal(VolumeDetachModal, props, function () {
        actions.InstanceVolumeActions.detach({
          volume: volume
        })
      })

    }

  };

});
