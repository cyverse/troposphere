define(function (require) {
  "use strict";

  var ModalHelpers = require('components/modals/ModalHelpers'),
      InstanceRebootModal = require('components/modals/instance/InstanceRebootModal.react'),
      actions = require('actions');

  return {

    reboot: function (instance) {
      ModalHelpers.renderModal(InstanceRebootModal, null, function () {
        actions.InstanceActions.reboot({
          instance: instance
        });
      });
    }

  };

});
