define(function (require) {
  "use strict";

  var InstanceConstants = require('constants/InstanceConstants'),
      InstanceState = require('models/InstanceState'),
      NotificationController = require('controllers/NotificationController'),
      ModalHelpers = require('components/modals/ModalHelpers'),
      InstanceStartModal = require('components/modals/instance/InstanceStartModal.react'),
      Utils = require('../Utils');

  return {
    start: function(instance){
      var modal = InstanceStartModal();

      ModalHelpers.renderModal(modal, function () {
        var instanceState = new InstanceState({status_raw: "shutoff - powering-on"});
        var originalState = instance.get('state');
        instance.set({state: instanceState});
        Utils.dispatch(InstanceConstants.UPDATE_INSTANCE, {instance: instance});

        instance.start({
         success: function (model) {
           var instanceState = new InstanceState({status_raw: "shutoff - powering-on"});
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
              NotificationController.error("Your instance could not be started.", error.message);
           }else{
              NotificationController.error("Your instance could not be started", "If the problem persists, please report the instance.");
           }
         }
       });
      })
    }
  };

});
