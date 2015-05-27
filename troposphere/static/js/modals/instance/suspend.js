define(function (require) {
  "use strict";

  var ModalHelpers = require('components/modals/ModalHelpers'),
      InstanceSuspendModal = require('components/modals/instance/InstanceSuspendModal.react'),
      actions = require('actions');

  return {

    suspend: function (instance) {
      var modal = InstanceSuspendModal();

      ModalHelpers.renderModal(modal, function () {
        actions.InstanceActions.suspend({
          instance: instance
        })
      });
    }

  };

});
