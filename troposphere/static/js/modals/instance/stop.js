define(function (require) {
  "use strict";

  var ModalHelpers = require('components/modals/ModalHelpers'),
    InstanceStopModal = require('components/modals/instance/InstanceStopModal.react'),
    actions = require('actions');

  return {

    stop: function (instance) {
      ModalHelpers.renderModal(InstanceStopModal, null, function () {
        actions.InstanceActions.stop({
          instance: instance
        });
      })
    }

  };

});
