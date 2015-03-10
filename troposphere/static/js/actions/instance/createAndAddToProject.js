define(function (require) {
  "use strict";

  var React = require('react'),
      actions = require('actions'),
      stores = require('stores'),
      ModalHelpers = require('components/modals/ModalHelpers'),
      ProjectInstanceLaunchModal = require('components/modals/project/ProjectInstanceLaunchModal.react');

  return {

    createAndAddToProject: function(options){
      if(!options.project) throw new Error("Missing project");

      var project = options.project,
          modal = React.createElement(ProjectInstanceLaunchModal);

      ModalHelpers.renderModal(modal, function (application, identity, machineId, sizeId, instanceName) {
        var size = stores.SizeStore.get(sizeId),
            machine = application.get('machines').get(machineId);

        actions.InstanceActions.launchIntoProject({
          project: project,
          instanceName: instanceName,
          identity: identity,
          size: size,
          machine: machine
        });
      });
    }

  };

});
