define(function (require) {
  "use strict";

  var React = require('react'),
      actions = require('actions'),
      stores = require('stores'),
      ModalHelpers = require('components/modals/ModalHelpers'),
      InstanceLaunchWizardModal = require('components/modals/instance/InstanceLaunchWizardModal.react');

  return {

    createAndAddToProject: function(options){
      if(!options.project) throw new Error("Missing project");

<<<<<<< HEAD
      var project = options.project,
          modal = InstanceLaunchWizardModal({
        project: project,
      }); //NOTE: was 'createElement?'

      //NOTE: Why do this here? Shouldn't this happen on success of the wizard anyway?
      ModalHelpers.renderModal(modal, function (launchData) {
        var size = launchData.size,
            version = launchData.version,
            identity = launchData.identity,
            name = launchData.name,
            project = launchData.project;
=======
      var project = options.project;

      ModalHelpers.renderModal(ProjectInstanceLaunchModal, null, function (application, identity, machineId, sizeId, instanceName) {
        var size = stores.SizeStore.get(sizeId),
            machine = application.get('machines').get(machineId);
>>>>>>> f82330df01e1af0a0a630f6ebfcc51e2dda54b31

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
