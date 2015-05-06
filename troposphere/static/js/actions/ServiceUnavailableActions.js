define(function (require) {

  var AppDispatcher = require('dispatchers/AppDispatcher'),
      ModalHelpers = require('components/modals/ModalHelpers'),
      ServiceUnavailableModal = require('components/modals/ServiceUnavailableModal.react'),
      Utils = require('./Utils');

  return {

    showMaintenanceModal: function () {
      var modal = ServiceUnavailableModal();

      ModalHelpers.renderModal(modal, function(){
        console.log("modal closed");
      });
    }

  }

});
