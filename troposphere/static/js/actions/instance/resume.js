define(function (require) {
  "use strict";

  var InstanceConstants = require('constants/InstanceConstants'),
      Instance = require('models/Instance'),
      InstanceState = require('models/InstanceState'),
      NotificationController = require('controllers/NotificationController'),
      ModalHelpers = require('components/modals/ModalHelpers'),
      InstanceResumeModal = require('components/modals/instance/InstanceResumeModal.react'),
      Utils = require('./Utils');

  return {
    resume: function(instance){
      var modal = InstanceResumeModal();

      ModalHelpers.renderModal(modal, function () {
        var instanceState = new InstanceState({status_raw: "suspended - resuming"});
        var originalState = instance.get('state');

        instance.set({state: instanceState});
        Utils.dispatch(InstanceConstants.UPDATE_INSTANCE, {instance: instance});

        instance.resume({
         success: function (model) {
           var instanceState = new InstanceState({status_raw: "suspended - resuming"});
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
              NotificationController.error("Your instance could not be resumed.", error.message);
           }else{
              NotificationController.error("Your instance could not be resumed", "If the problem persists, please report the instance.");
           }
         }
       });
      });

    }
  };

});
