define(function (require) {
  "use strict";

  var actions = require('actions'),
      stores = require('stores'),
      ModalHelpers = require('components/modals/ModalHelpers'),
      InstanceLaunchModal = require('components/modals/instance/InstanceLaunchModal.react');

  return {

    launch: function(application){
      var props = {
        application: application
      };

      ModalHelpers.renderModal(InstanceLaunchModal, props, function (identity, machineId, sizeId, instanceName, project) {
        var size = stores.SizeStore.get(sizeId),
            machine = application.get('machines').get(machineId);

        if(typeof project === "string"){
          actions.InstanceActions.createProjectAndLaunchInstance({
            projectName: project,
            instanceName: instanceName,
            identity: identity,
            size: size,
            machine: machine
          });
        }else{
          actions.InstanceActions.launch({
            project: project,
            instanceName: instanceName,
            identity: identity,
            size: size,
            machine: machine
          });
        }
      })
    }
  };

});
