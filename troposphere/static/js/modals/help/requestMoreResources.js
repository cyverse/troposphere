define(function (require) {
  "use strict";

  var React = require('react'),
      actions = require('actions'),
      stores = require('stores'),
      ModalHelpers = require('components/modals/ModalHelpers'),
      RequestMoreResourcesModal = require('components/modals/RequestMoreResourcesModal.react'),
      ProjectInstanceLaunchModal = require('components/modals/project/ProjectInstanceLaunchModal.react');

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
