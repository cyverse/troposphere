define(function (require) {
  "use strict";

  var InstanceConstants = require('constants/InstanceConstants'),
      InstanceState = require('models/InstanceState'),
      NotificationController = require('controllers/NotificationController'),
      ModalHelpers = require('components/modals/ModalHelpers'),
      InstanceRebootModal = require('components/modals/instance/InstanceRebootModal.react'),
      Utils = require('../Utils');

  return {
    reboot: function (instance) {
      var modal = InstanceRebootModal();

      ModalHelpers.renderModal(modal, function () {
        // If user desires a hard reboot, need to pass an additional argument of reboot_type
        // action: "reboot"
        // reboot_type: "HARD"

        var instanceState = new InstanceState({status_raw: "active - rebooting"});
        var originalState = instance.get('state');
        instance.set({state: instanceState});
        Utils.dispatch(InstanceConstants.UPDATE_INSTANCE, {instance: instance});

        instance.reboot({
         success: function (model) {
           var instanceState = new InstanceState({status_raw: "active - rebooting"});
           instance.set({state: instanceState});

           Utils.dispatch(InstanceConstants.UPDATE_INSTANCE, {instance: instance});
           Utils.dispatch(InstanceConstants.POLL_INSTANCE, {instance: instance});
         },
         error: function (response) {
           instance.set({state: originalState});
           Utils.dispatch(InstanceConstants.UPDATE_INSTANCE, {instance: instance});
           Utils.dispatch(InstanceConstants.POLL_INSTANCE, {instance: instance});

           if(response && response.responseJSON && response.responseJSON.errors){
              var errors = response.responseJSON.errors;
              var error = errors[0];
              NotificationController.error("Instance could not be rebooted", error.message);
           }else{
              NotificationController.error("Instance could not be rebooted", "If the problem persists, please report the instance.");
           }
         }
       });
      });
    }
  };

});
