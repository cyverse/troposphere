define(function (require) {
  "use strict";

  var actions = require('actions'),
    ModalHelpers = require('components/modals/ModalHelpers'),
    UnsupportedModal = require('components/modals/unsupported/UnsupportedModal.react');
  return {

    showModal: function (setState) {

      var props = {
        header: "Unsupported Features",
        closeUnsupportedModal: setState
      };

      ModalHelpers.renderModal(UnsupportedModal, props, function () {
      });
    }

  };

});
