define(function (require) {
  "use strict";

  var ModalHelpers = require('components/modals/ModalHelpers'),
    InstanceResumeModal = require('components/modals/instance/InstanceResumeModal.react'),
    actions = require('actions');

  return {

    resume: function (instance) {
      ModalHelpers.renderModal(InstanceResumeModal, null, function () {
        actions.InstanceActions.resume({
          instance: instance
        })
      });
    }

  };

});
