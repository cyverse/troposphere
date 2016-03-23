define(function (require) {
  "use strict";

  var actions = require('actions'),
    stores = require('stores'),
    ModalHelpers = require('components/modals/ModalHelpers'),
    VolumeDetachModal = require('components/modals/volume/VolumeDetachModal.react');

  return {

    detach: function (volume) {
      var helpLink = stores.HelpLinkStore.get('volumes'),
        props = {
          volume: volume,
          helpLink: helpLink
        };

      ModalHelpers.renderModal(VolumeDetachModal, props, function () {
        actions.InstanceVolumeActions.detach({
          volume: volume,
          helpLink: helpLink
        })
      })

    }

  };

});
