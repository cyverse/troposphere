define(function (require) {
  "use strict";

  var InstanceConstants = require('constants/InstanceConstants'),
      InstanceState = require('models/InstanceState'),
      NotificationController = require('controllers/NotificationController'),
      stores = require('stores'),
      ModalHelpers = require('components/modals/ModalHelpers'),
      InstanceSuspendModal = require('components/modals/instance/InstanceSuspendModal.react'),
      Utils = require('../Utils');

  return {
    suspend: function (instance) {
      var modal = InstanceSuspendModal();

      ModalHelpers.renderModal(modal, function () {
        var instanceState = new InstanceState({status_raw: "active - suspending"});
        var originalState = instance.get('state');
        instance.set({state: instanceState});
        Utils.dispatch(InstanceConstants.UPDATE_INSTANCE, {instance: instance});

        instance.suspend({
         success: function (model) {
           var instanceState = new InstanceState({status_raw: "active - suspending"});
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
              NotificationController.error("Your instance could not be suspended.", error.message);
           }else{
              NotificationController.error("Your instance could not be suspended", "If the problem persists, please report the instance.");
           }
         }
       });
      });
    }
  };

});
