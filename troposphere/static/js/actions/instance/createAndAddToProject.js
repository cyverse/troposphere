define(function (require) {
  "use strict";

  var React = require('react'),
      InstanceConstants = require('constants/InstanceConstants'),
      ProjectInstanceConstants = require('constants/ProjectInstanceConstants'),
      Instance = require('models/Instance'),
      NotificationController = require('controllers/NotificationController'),
      actions = require('actions'),
      ModalHelpers = require('components/modals/ModalHelpers'),
      ProjectInstanceLaunchModal = require('components/modals/project/ProjectInstanceLaunchModal.react'),
      Utils = require('../Utils');

  return {


    createAndAddToProjectNoModal: function(identity, machineId, sizeId, instanceName, project){
      var instance = new Instance({
        name: instanceName,
        size_alias: sizeId,
        identity: {
          id: identity.id,
          provider: identity.get('provider').id
        },
        status: "build - scheduling"
      }, {parse: true});

      var params = {
        machine_alias: machineId,
        size_alias: sizeId,
        name: instanceName
      };

      Utils.dispatch(InstanceConstants.ADD_INSTANCE, {instance: instance});
      Utils.dispatch(ProjectInstanceConstants.ADD_PENDING_INSTANCE_TO_PROJECT, {
        instance: instance,
        project: project
      });

      instance.save(null, {
        data: JSON.stringify(params),
        success: function (model) {
          Utils.dispatch(InstanceConstants.UPDATE_INSTANCE, {instance: instance});
          Utils.dispatch(InstanceConstants.POLL_INSTANCE, {instance: instance});
          Utils.dispatch(ProjectInstanceConstants.REMOVE_PENDING_INSTANCE_FROM_PROJECT, {
            instance: instance,
            project: project
          });
          actions.ProjectInstanceActions.addInstanceToProject(instance, project);
        },
        error: function (response) {
          Utils.dispatch(InstanceConstants.REMOVE_INSTANCE, {instance: instance});
          Utils.dispatch(ProjectInstanceConstants.REMOVE_PENDING_INSTANCE_FROM_PROJECT, {
            instance: instance,
            project: project
          });

          if(response && response.responseJSON && response.responseJSON.errors){
            var errors = response.responseJSON.errors;
            var error = errors[0];
            NotificationController.error("Instance could not be launched", error.message);
          }else{
            NotificationController.error("Instance could not be launched", "If the problem persists, please send an email to support@iplantcollaborative.org.");
          }
        }
      });
    },

    createAndAddToProject: function(options){
      var project = options.project;
      var modal = React.createElement(ProjectInstanceLaunchModal);

      ModalHelpers.renderModal(modal, function (identity, machineId, sizeId, instanceName) {
        this.createAndAddToProjectNoModal(identity, machineId, sizeId, instanceName, project);
      }.bind(this));
    }

  };

});
