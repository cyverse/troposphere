define(function (require) {
  "use strict";

  var actions = require('actions'),
      stores = require('stores'),
      ModalHelpers = require('components/modals/ModalHelpers'),
      InstanceLaunchWizardModal = require('components/modals/instance/InstanceLaunchWizardModal.react');

  return {

    launch: function(application){
      var props = {application: application};

      ModalHelpers.renderModal(InstanceLaunchWizardModal, props, function (launchData) {
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
