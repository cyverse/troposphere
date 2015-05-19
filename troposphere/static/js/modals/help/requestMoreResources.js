define(function (require) {
  "use strict";

  var actions = require('actions'),
      ModalHelpers = require('components/modals/ModalHelpers'),
      RequestMoreResourcesModal = require('components/modals/RequestMoreResourcesModal.react')
  return {

    requestMoreResources: function(){

      var modal = RequestMoreResourcesModal();

      ModalHelpers.renderModal(modal, function(identity, quota, reason){

        actions.HelpActions.requestMoreResources({
          identity: identity,
          quota: quota,
          reason: reason
        });
      });
    }

  };

});
