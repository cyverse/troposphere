define(function (require) {
  "use strict";

  var actions = require('actions'),
      stores = require('stores'),
      ModalHelpers = require('components/modals/ModalHelpers'),
      InstanceLaunchWizardModal = require('components/modals/instance/InstanceLaunchWizardModal.react');

  return {

    launch: function(application){
      var modal = InstanceLaunchWizardModal({
        application: application
      };

      ModalHelpers.renderModal(modal, function (launchData) {
        var size = launchData.size,
            version = launchData.version,
            identity = launchData.identity,
            name = launchData.name,
            project = launchData.project;

          actions.InstanceActions.launch({
            project: project,
            instanceName: name,
            identity: identity,
            size: size,
            machine: version
          });
      });
    }
  };

});
