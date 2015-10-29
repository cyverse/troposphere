import React from 'react/addons';
import actions from 'actions';
import stores from 'stores';
import ModalHelpers from 'components/modals/ModalHelpers';
import InstanceLaunchWizardModal from 'components/modals/instance/InstanceLaunchWizardModal.react';

export default {
    createAndAddToProject: function (options) {
      if (!options.project) throw new Error("Missing project");

      var project = options.project,
        props = {project: project};

      ModalHelpers.renderModal(InstanceLaunchWizardModal, props, function (launchData) {
        var size = launchData.size,
            version = launchData.version,
            identity = launchData.identity,
            name = launchData.name,
            project = launchData.project,
            scripts = launchData.activeScripts;

        actions.InstanceActions.launch({
          project: project,
          instanceName: name,
          identity: identity,
          size: size,
          version: version,
          scripts: scripts
        });
      });
    }
};
