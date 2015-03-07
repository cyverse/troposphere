define(function (require) {
  "use strict";

  var InstanceConstants = require('constants/InstanceConstants'),
      InstanceState = require('models/InstanceState'),
      NotificationController = require('controllers/NotificationController'),
      ModalHelpers = require('components/modals/ModalHelpers'),
      InstanceStopModal = require('components/modals/instance/InstanceStopModal.react'),
      Utils = require('../Utils');

  return {
    stop: function(instance){
      var modal = InstanceStopModal();

      ModalHelpers.renderModal(modal, function () {

        var instanceState = new InstanceState({status_raw: "active - powering-off"});
        var originalState = instance.get('state');
        instance.set({state: instanceState});
        Utils.dispatch(InstanceConstants.UPDATE_INSTANCE, {instance: instance});

        instance.stop({
         success: function (model) {
           var instanceState = new InstanceState({status_raw: "active - powering-off"});
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
              NotificationController.error("Your instance could not be stopped.", error.message);
           }else{
              NotificationController.error("Your instance could not be stopped", "If the problem persists, please report the instance.");
           }
         }
       });
      })
    }
  };

});
