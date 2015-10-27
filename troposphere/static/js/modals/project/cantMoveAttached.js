define(function (require) {

  var actions = require('actions'),
    ModalHelpers = require('components/modals/ModalHelpers'),
    CantMoveAttachedModal = require('components/modals/project/CantMoveAttachedModal.react');

  return {
    cantMoveAttached: function () {
      ModalHelpers.renderModal(CantMoveAttachedModal, null, function () {
      });
    }
  }

});
