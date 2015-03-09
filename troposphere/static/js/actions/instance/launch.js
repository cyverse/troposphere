define(function (require) {
  "use strict";

  var InstanceConstants = require('constants/InstanceConstants'),
      ProjectInstanceConstants = require('constants/ProjectInstanceConstants'),
      ProjectConstants = require('constants/ProjectConstants'),
      Instance = require('models/Instance'),
      InstanceState = require('models/InstanceState'),
      Project = require('models/Project'),
      Router = require('Router'),
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
        var size = stores.SizeStore.get(sizeId),
            machine = application.get('machines').get(machineId);

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
            size: {
              id: sizeId,
              alias: size.get('alias')
            },
            status: "build - scheduling",
            provider: {
              id: identity.get('provider').id,
              uuid: identity.get('provider').uuid
            },
            identity: {
              id: identity.id,
              uuid: identity.get('uuid')
            }
          }, {parse: true});

          Utils.dispatch(InstanceConstants.ADD_INSTANCE, {instance: instance});
          // todo: hook this back up if experience seems to slow...not connected right now
          // Utils.dispatch(ProjectInstanceConstants.ADD_PENDING_INSTANCE_TO_PROJECT, {
          //   instance: instance,
          //   project: project
          // });

          instance.createOnV1Endpoint({
            machine_alias: machine.get('uuid'),
            size_alias: size.get('alias'),
            name: instanceName
          }).done(function(attrs, status, response) {
            instance.set('id', attrs.id);
            instance.fetch().done(function(){
              // todo: remove hack and start using ProjectInstance endpoint to discover
              // which project an instance is in
              instance.set('projects', [project.id]);

              Utils.dispatch(InstanceConstants.UPDATE_INSTANCE, {instance: instance});
              Utils.dispatch(InstanceConstants.POLL_INSTANCE, {instance: instance});

              // todo: hook this back up if experience seems to slow...not connected right now
              // Utils.dispatch(ProjectInstanceConstants.REMOVE_PENDING_INSTANCE_FROM_PROJECT, {
              //   instance: instance,
              //   project: project
              // });

              actions.ProjectInstanceActions.addInstanceToProject(instance, project);
            });
          }).fail(function (response) {
            Utils.dispatch(InstanceConstants.REMOVE_INSTANCE, {instance: instance});

            // todo: hook this back up if experience seems to slow...not connected right now
            // Utils.dispatch(ProjectInstanceConstants.REMOVE_PENDING_INSTANCE_FROM_PROJECT, {
            //   instance: instance,
            //   project: project
            // });

            if(response.responseJSON && response.responseJSON.errors) {
              var error = response.responseJSON.errors[0];
              NotificationController.error(
                "Instance could not be launched",
                error.code + ":" + error.message
              );
            } else {
              NotificationController.error(
                "Instance could not be launched",
                "If the problem persists, please report the instance."
              );
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
