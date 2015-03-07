define(function (require) {
  "use strict";

  var InstanceConstants = require('constants/InstanceConstants'),
      Instance = require('models/Instance'),
      InstanceState = require('models/InstanceState'),
      NotificationController = require('controllers/NotificationController'),
      ModalHelpers = require('components/modals/ModalHelpers'),
      InstanceResumeModal = require('components/modals/instance/InstanceResumeModal.react'),
      Utils = require('../Utils'),
      InstanceActionRequest = require('models/InstanceActionRequest');

  return {
    resume: function(instance){
      var modal = InstanceResumeModal();

      ModalHelpers.renderModal(modal, function () {
        var instanceState = new InstanceState({status_raw: "suspended - resuming"});
        var originalState = instance.get('state');

        instance.set({state: instanceState});
        Utils.dispatch(InstanceConstants.UPDATE_INSTANCE, {instance: instance});

        var actionRequest = new InstanceActionRequest({instance: instance});
        actionRequest.save(null, {
          attrs: {action: "asdf"}
        }).done(function(){
          var instanceState = new InstanceState({status_raw: "suspended - resuming"});
           instance.set({state: instanceState});

           Utils.dispatch(InstanceConstants.UPDATE_INSTANCE, {instance: instance});
           Utils.dispatch(InstanceConstants.POLL_INSTANCE, {instance: instance});
        }).error(function(response){
          try {
            var error = response.responseJSON.errors[0];
            NotificationController.error(
              "Your instance could not be resumed",
              error.code + ": " + error.message
            );
          }
          catch(err){
            NotificationController.error(
              "Your instance could not be resumed",
              "If the problem persists, please contact support."
            );
          }

          instance.set({state: originalState});
          Utils.dispatch(InstanceConstants.UPDATE_INSTANCE, {instance: instance});
          Utils.dispatch(InstanceConstants.POLL_INSTANCE, {instance: instance});
        });
      });

    }
  };

});
