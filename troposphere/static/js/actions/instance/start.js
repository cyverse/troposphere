define(function (require) {
  "use strict";

  var InstanceConstants = require('constants/InstanceConstants'),
      InstanceState = require('models/InstanceState'),
      ModalHelpers = require('components/modals/ModalHelpers'),
      InstanceStartModal = require('components/modals/instance/InstanceStartModal.react'),
      Utils = require('../Utils'),
      InstanceActionRequest = require('models/InstanceActionRequest');

  return {

    start: function(instance){
      var modal = InstanceStartModal();

      ModalHelpers.renderModal(modal, function () {
        var instanceState = new InstanceState({status_raw: "shutoff - powering-on"}),
            originalState = instance.get('state'),
            actionRequest = new InstanceActionRequest({instance: instance});

        instance.set({state: instanceState});
        Utils.dispatch(InstanceConstants.UPDATE_INSTANCE, {instance: instance});

        actionRequest.save(null, {
          attrs: {action: "start"}
        }).done(function(){
          instance.set({
            state: new InstanceState({status_raw: "shutoff - powering-on"})
          });
        }).fail(function(response){
          instance.set({state: originalState});
          Utils.displayError({title: "Your instance could not be started", response: response});
        }).always(function(){
          Utils.dispatch(InstanceConstants.UPDATE_INSTANCE, {instance: instance});
          Utils.dispatch(InstanceConstants.POLL_INSTANCE, {instance: instance});
        });
      });
    }

  };

});
