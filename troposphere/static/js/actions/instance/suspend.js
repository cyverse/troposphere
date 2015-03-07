define(function (require) {
  "use strict";

  var InstanceConstants = require('constants/InstanceConstants'),
      InstanceState = require('models/InstanceState'),
      ModalHelpers = require('components/modals/ModalHelpers'),
      InstanceSuspendModal = require('components/modals/instance/InstanceSuspendModal.react'),
      Utils = require('../Utils'),
      InstanceActionRequest = require('models/InstanceActionRequest');

  return {
    suspend: function (instance) {
      var modal = InstanceSuspendModal();

      ModalHelpers.renderModal(modal, function () {
        var instanceState = new InstanceState({status_raw: "active - suspending"}),
            originalState = instance.get('state'),
            actionRequest = new InstanceActionRequest({instance: instance});

        instance.set({state: instanceState});
        Utils.dispatch(InstanceConstants.UPDATE_INSTANCE, {instance: instance});

        actionRequest.save(null, {
          attrs: {action: "suspend"}
        }).done(function(){
          instance.set({
            state: new InstanceState({status_raw: "active - suspending"})
          });
        }).fail(function(response){
          instance.set({state: originalState});
          Utils.displayError({title: "Your instance could not be suspended", response: response});
        }).always(function(){
          Utils.dispatch(InstanceConstants.UPDATE_INSTANCE, {instance: instance});
          Utils.dispatch(InstanceConstants.POLL_INSTANCE, {instance: instance});
        });
      });
    }
  };

});
