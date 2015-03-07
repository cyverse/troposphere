define(function (require) {
  "use strict";

  var InstanceConstants = require('constants/InstanceConstants'),
      InstanceState = require('models/InstanceState'),
      ModalHelpers = require('components/modals/ModalHelpers'),
      InstanceResumeModal = require('components/modals/instance/InstanceResumeModal.react'),
      Utils = require('../Utils'),
      InstanceActionRequest = require('models/InstanceActionRequest');

  return {
    resume: function(instance){
      var modal = InstanceResumeModal();

      ModalHelpers.renderModal(modal, function () {
        var instanceState = new InstanceState({status_raw: "suspended - resuming"}),
            originalState = instance.get('state'),
            actionRequest = new InstanceActionRequest({instance: instance});

        instance.set({state: instanceState});
        Utils.dispatch(InstanceConstants.UPDATE_INSTANCE, {instance: instance});

        actionRequest.save(null, {
          attrs: {action: "resume"}
        }).done(function(){
          instance.set({
            state: new InstanceState({status_raw: "suspended - resuming"})
          });
        }).fail(function(response){
          instance.set({state: originalState});
          Utils.displayError({title: "Your instance could not be resumed", response: response});
        }).always(function(){
          Utils.dispatch(InstanceConstants.UPDATE_INSTANCE, {instance: instance});
          Utils.dispatch(InstanceConstants.POLL_INSTANCE, {instance: instance});
        });
      });

    }
  };

});
