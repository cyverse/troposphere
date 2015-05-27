define(function (require) {
  "use strict";

  var ModalHelpers = require('components/modals/ModalHelpers'),
      InstanceStartModal = require('components/modals/instance/InstanceStartModal.react'),
      actions = require('actions');

  return {

    start: function(instance){
      var modal = InstanceStartModal();

      ModalHelpers.renderModal(modal, function () {
        actions.InstanceActions.start({
          instance: instance
        })
      });
    }

  };

});
