define(function (require) {
  "use strict";

  var ModalHelpers = require('components/modals/ModalHelpers'),
      InstanceResumeModal = require('components/modals/instance/InstanceResumeModal.react'),
      actions = require('actions');

  return {

    resume: function(instance){
      var modal = InstanceResumeModal();

      ModalHelpers.renderModal(modal, function () {
        actions.InstanceActions.resume({
          instance: instance
        })
      });
    }

  };

});
