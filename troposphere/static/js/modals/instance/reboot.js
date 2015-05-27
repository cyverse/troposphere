define(function (require) {
  "use strict";

  var ModalHelpers = require('components/modals/ModalHelpers'),
      InstanceRebootModal = require('components/modals/instance/InstanceRebootModal.react'),
      actions = require('actions');

  return {

    reboot: function (instance) {
      var modal = InstanceRebootModal();

      ModalHelpers.renderModal(modal, function () {
        actions.InstanceActions.reboot({
          instance: instance
        });
      });
    }

  };

});
