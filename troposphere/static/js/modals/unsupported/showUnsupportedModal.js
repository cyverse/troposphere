define(function (require) {
  "use strict";

  var actions = require('actions'),
    ModalHelpers = require('components/modals/ModalHelpers'),
    UnsupportedModal = require('components/modals/unsupported/UnsupportedModal.react');
  return {

    showModal: function () {

      var props = {
        header: "Unsupported Features",
      };

      ModalHelpers.renderModal(UnsupportedModal, props, function (feedback) {
            console.log('unsupported');
      });
    }

  };

});
