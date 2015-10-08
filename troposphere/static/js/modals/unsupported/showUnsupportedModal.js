define(function (require) {
  "use strict";

  var actions = require('actions'),
    ModalHelpers = require('components/modals/ModalHelpers'),
    UnsupportedModal = require('components/modals/unsupported/UnsupportedModal.react');
  return {

    showModal: function (handler) {

      var props = {
        header: "Unsupported Features",
        closeUnsupportedModal: handler,
        backdrop:"static",
        keyboard:false
      };

      ModalHelpers.renderModal(UnsupportedModal, props, function () {
      });
    }

  };

});
