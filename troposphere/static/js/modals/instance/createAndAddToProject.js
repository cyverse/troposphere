define(function (require) {
  "use strict";

  var React = require('react/addons'),
    actions = require('actions'),
    stores = require('stores'),
    ModalHelpers = require('components/modals/ModalHelpers'),
    InstanceLaunchWizardModal = require('components/modals/instance/InstanceLaunchWizardModal.react');

  return {

    createAndAddToProject: function (options) {
      if (!options.project) throw new Error("Missing project");

      var project = options.project,
        props = {project: project};

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
          version: version
        });
      });
    }

  };

});
