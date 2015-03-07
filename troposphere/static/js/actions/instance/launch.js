define(function (require) {
  "use strict";

  var InstanceConstants = require('constants/InstanceConstants'),
      ProjectInstanceConstants = require('constants/ProjectInstanceConstants'),
      ProjectConstants = require('constants/ProjectConstants'),
      Instance = require('models/Instance'),
      InstanceState = require('models/InstanceState'),
      Project = require('models/Project'),
      Router = require('../Router'),
      NotificationController = require('controllers/NotificationController'),
      actions = require('actions'),
      stores = require('stores'),

      // Modals
      ModalHelpers = require('components/modals/ModalHelpers'),
      InstanceLaunchModal = require('components/modals/instance/InstanceLaunchModal.react'),
      Utils = require('../Utils');

  return {
    launch: function(application){
      var that = this;

      var modal = InstanceLaunchModal({
        application: application
      });

      ModalHelpers.renderModal(modal, function (identity, machineId, sizeId, instanceName, project) {
        if(typeof project === "string"){
          var projectName = project;
          project = new Project({
            name: projectName,
            description: projectName,
            instances: [],
            volumes:[]
          });

          Utils.dispatch(ProjectConstants.ADD_PROJECT, {project: project});

          project.save().done(function(){
            //NotificationController.success(null, "Project " + project.get('name') + " created.");
            Utils.dispatch(ProjectConstants.UPDATE_PROJECT, {project: project});
            that._createAndAddToProjectNoModal(identity, machineId, sizeId, instanceName, project);

            // Since this is triggered from the images page, navigate off
            // that page and back to the instance list so the user can see
            // their instance being created
            Router.getInstance().transitionTo("project-resources", {projectId: project.id});

          }).fail(function(response){
            Utils.dispatch(ProjectConstants.REMOVE_PROJECT, {project: project});
            var title = "Project " + project.get('name') + " could not be created";
            if(response && response.responseJSON && response.responseJSON.errors){
                var errors = response.responseJSON.errors;
                var error = errors[0];
                NotificationController.error(title, error.message);
             }else{
                NotificationController.error(title, "If the problem persists, please let support at support@iplantcollaborative.org.");
             }
          });

        }else{
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
              //NotificationController.success(null, 'Instance launching...');
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
                NotificationController.error("Instance could not be launched", "If the problem persists, please report the instance.");
             }
            }
          });

          // Since this is triggered from the images page, navigate off
          // that page and back to the instance list so the user can see
          // their instance being created
          Router.getInstance().transitionTo("project-resources", {projectId: project.id});
        }
      })
    }
  };

});
