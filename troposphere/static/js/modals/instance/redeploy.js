define(function (require) {
  "use strict";

  var ModalHelpers = require('components/modals/ModalHelpers'),
      InstanceRedeployModal = require('components/modals/instance/InstanceRedeployModal.react'),
      actions = require('actions');

  return {

    redeploy: function (instance) {
      ModalHelpers.renderModal(InstanceRedeployModal, null, function () {
        actions.InstanceActions.redeploy({
          instance: instance
        });
      });
    }

  };

});
