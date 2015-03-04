define(
  [
    'react',
    'dispatchers/AppDispatcher',
    'constants/InstanceConstants',
    'constants/ProjectInstanceConstants',
    'constants/ProjectConstants',
    'models/Instance',
    'models/InstanceState',
    'models/Project',
    'globals',
    'context',
    'url',
    'controllers/NotificationController',
    'actions/ProjectInstanceActions',
    'stores',

    // Modals
    'components/modals/ModalHelpers',
    'components/modals/instance/InstanceSuspendModal.react',
    'components/modals/instance/InstanceDeleteModal.react',
    'components/modals/instance/InstanceResumeModal.react',
    'components/modals/instance/InstanceStopModal.react',
    'components/modals/instance/InstanceStartModal.react',
    'components/modals/instance/InstanceRebootModal.react',
    'components/modals/instance/InstanceLaunchModal.react',
    'components/modals/instance/ExplainInstanceDeleteConditionsModal.react',
    'components/modals/project/ProjectInstanceLaunchModal.react',
    'components/modals/instance/InstanceReportModal.react',
    'components/modals/instance/InstanceImageModal.react',
    './Utils'
  ],
  function (React, AppDispatcher, InstanceConstants, ProjectInstanceConstants, ProjectConstants, Instance, InstanceState, Project, globals, context, URL, NotificationController, ProjectInstanceActions, stores, ModalHelpers, InstanceSuspendModal, InstanceDeleteModal, InstanceResumeModal, InstanceStopModal, InstanceStartModal, InstanceRebootModal, InstanceLaunchModal, ExplainInstanceDeleteConditionsModal, ProjectInstanceLaunchModal, InstanceReportModal, InstanceImageModal, Utils) {

    return {

      // ------------------------
      // Standard CRUD Operations
      // ------------------------

      updateInstanceAttributes: function (instance, newAttributes) {
        var that = this;

        instance.set(newAttributes);
        Utils.dispatch(InstanceConstants.UPDATE_INSTANCE, {instance: instance});

        instance.save({
          name: instance.get('name'),
          tags: instance.get('tags')
        }, {
          patch: true
        }).done(function () {
          //NotificationController.success(null, "Instance name and tags updated");
          Utils.dispatch(InstanceConstants.UPDATE_INSTANCE, {instance: instance});
        }).fail(function () {
          var message = "Error updating Instance " + instance.get('name') + ".";
          NotificationController.error(message);
          Utils.dispatch(InstanceConstants.UPDATE_INSTANCE, {instance: instance});
        });
      },

      addTagToInstance: function(tag, instance){
        var that = this;
        var instanceTags = instance.get('tags');
        instanceTags.push(tag.get('name'));

        instance.set({tags: instanceTags});
        Utils.dispatch(InstanceConstants.UPDATE_INSTANCE, {instance: instance});

        instance.save({
          tags: instanceTags
        }, {
          patch: true
        }).done(function () {
          Utils.dispatch(InstanceConstants.UPDATE_INSTANCE, {instance: instance});
        }).fail(function () {
          NotificationController.error(null, "Error adding tag to Instance");
          Utils.dispatch(InstanceConstants.UPDATE_INSTANCE, {instance: instance});
        });
      },

      _terminate: function(payload, options){
        var instance = payload.instance;
        var project = payload.project;
        var that = this;

        var instanceState = new InstanceState({status_raw: "deleting"});
        var originalState = instance.get('state');
        instance.set({state: instanceState});
        Utils.dispatch(InstanceConstants.UPDATE_INSTANCE, {instance: instance});

        instance.destroy().done(function () {
          //NotificationController.success(null, 'Instance terminated');
          Utils.dispatch(InstanceConstants.REMOVE_INSTANCE, {instance: instance});
          ProjectInstanceActions.removeInstanceFromProject(instance, project);

        }).fail(function (response) {
          instance.set({state: originalState});
          Utils.dispatch(InstanceConstants.UPDATE_INSTANCE, {instance: instance});
          Utils.dispatch(InstanceConstants.POLL_INSTANCE, {instance: instance});

          if(response && response.responseJSON && response.responseJSON.errors){
              var errors = response.responseJSON.errors;
              var error = errors[0];
              NotificationController.error("Your instance could not be deleted.", error.message);
           }else{
              NotificationController.error("Your instance could not be deleted", "If the problem persists, please report the instance.");
           }
        });
      },

      terminate: function(payload, options){
        var instance = payload.instance;
        var redirectUrl = payload.redirectUrl;
        var project = payload.project;
        var that = this;

        var attachedVolumes = stores.VolumeStore.getVolumesAttachedToInstance(instance);
        if(attachedVolumes.length > 0){
          var modal = ExplainInstanceDeleteConditionsModal({
            attachedVolumes: attachedVolumes,
            backdrop: 'static'
          });

          ModalHelpers.renderModal(modal, function(){});

        }else{
          var modal = InstanceDeleteModal({
            instance: payload.instance
          });

          ModalHelpers.renderModal(modal, function () {
            that._terminate(payload, options);
            if(redirectUrl) Backbone.history.navigate(redirectUrl, {trigger: true});
          });

        }
      },

      terminate_noModal: function(payload, options){
        this._terminate(payload, options);
      },

      // ----------------
      // Instance Actions
      // ----------------

      suspend: function (instance) {
        var that = this;

        var modal = InstanceSuspendModal();

        ModalHelpers.renderModal(modal, function () {
          var instanceState = new InstanceState({status_raw: "active - suspending"});
          var originalState = instance.get('state');
          instance.set({state: instanceState});
          Utils.dispatch(InstanceConstants.UPDATE_INSTANCE, {instance: instance});

          instance.suspend({
           success: function (model) {
             //NotificationController.success(null, "Your instance is suspending...");

             var instanceState = new InstanceState({status_raw: "active - suspending"});
             instance.set({state: instanceState});

             Utils.dispatch(InstanceConstants.UPDATE_INSTANCE, {instance: instance});
             Utils.dispatch(InstanceConstants.POLL_INSTANCE, {instance: instance});
           },
           error: function (response) {
             instance.set({state: originalState});
             Utils.dispatch(InstanceConstants.UPDATE_INSTANCE, {instance: instance});
             Utils.dispatch(InstanceConstants.POLL_INSTANCE, {instance: instance});
             if(response && response.responseJSON && response.responseJSON.errors){
                var errors = response.responseJSON.errors;
                var error = errors[0];
                NotificationController.error("Your instance could not be suspended.", error.message);
             }else{
                NotificationController.error("Your instance could not be suspended", "If the problem persists, please report the instance.");
             }
           }
         });
        });
      },

      resume: function(instance){
        var that = this;

        var modal = InstanceResumeModal();

        ModalHelpers.renderModal(modal, function () {
          var instanceState = new InstanceState({status_raw: "suspended - resuming"});
          var originalState = instance.get('state');

          instance.set({state: instanceState});
          Utils.dispatch(InstanceConstants.UPDATE_INSTANCE, {instance: instance});

          instance.resume({
           success: function (model) {
             //NotificationController.success(null, "Your instance is resuming...");

             var instanceState = new InstanceState({status_raw: "suspended - resuming"});
             instance.set({state: instanceState});

             Utils.dispatch(InstanceConstants.UPDATE_INSTANCE, {instance: instance});
             Utils.dispatch(InstanceConstants.POLL_INSTANCE, {instance: instance});
           },
           error: function (response) {
            instance.set({state: originalState});
             Utils.dispatch(InstanceConstants.UPDATE_INSTANCE, {instance: instance});
             Utils.dispatch(InstanceConstants.POLL_INSTANCE, {instance: instance});

             if(response && response.responseJSON && response.responseJSON.errors){
                var errors = response.responseJSON.errors;
                var error = errors[0];
                NotificationController.error("Your instance could not be resumed.", error.message);
             }else{
                NotificationController.error("Your instance could not be resumed", "If the problem persists, please report the instance.");
             }
           }
         });
        });

      },

      stop: function(instance){
        var that = this;

        var modal = InstanceStopModal();

        ModalHelpers.renderModal(modal, function () {

          var instanceState = new InstanceState({status_raw: "active - powering-off"});
          var originalState = instance.get('state');
          instance.set({state: instanceState});
          Utils.dispatch(InstanceConstants.UPDATE_INSTANCE, {instance: instance});

          instance.stop({
           success: function (model) {
             //NotificationController.success(null, "Your instance is stopping...");

             var instanceState = new InstanceState({status_raw: "active - powering-off"});
             instance.set({state: instanceState});

             Utils.dispatch(InstanceConstants.UPDATE_INSTANCE, {instance: instance});
             Utils.dispatch(InstanceConstants.POLL_INSTANCE, {instance: instance});
           },
           error: function (response) {
             instance.set({state: originalState});
             Utils.dispatch(InstanceConstants.UPDATE_INSTANCE, {instance: instance});
             Utils.dispatch(InstanceConstants.POLL_INSTANCE, {instance: instance});

             if(response && response.responseJSON && response.responseJSON.errors){
                var errors = response.responseJSON.errors;
                var error = errors[0];
                NotificationController.error("Your instance could not be stopped.", error.message);
             }else{
                NotificationController.error("Your instance could not be stopped", "If the problem persists, please report the instance.");
             }
           }
         });
        })
      },

      start: function(instance){
        var that = this;

        var modal = InstanceStartModal();

        ModalHelpers.renderModal(modal, function () {
          var instanceState = new InstanceState({status_raw: "shutoff - powering-on"});
          var originalState = instance.get('state');
          instance.set({state: instanceState});
          Utils.dispatch(InstanceConstants.UPDATE_INSTANCE, {instance: instance});

          instance.start({
           success: function (model) {
             var instanceState = new InstanceState({status_raw: "shutoff - powering-on"});
             instance.set({state: instanceState});

             Utils.dispatch(InstanceConstants.UPDATE_INSTANCE, {instance: instance});
             Utils.dispatch(InstanceConstants.POLL_INSTANCE, {instance: instance});
           },
           error: function (response) {
             instance.set({state: originalState});
             Utils.dispatch(InstanceConstants.UPDATE_INSTANCE, {instance: instance});
             Utils.dispatch(InstanceConstants.POLL_INSTANCE, {instance: instance});
             if(response && response.responseJSON && response.responseJSON.errors){
                var errors = response.responseJSON.errors;
                var error = errors[0];
                NotificationController.error("Your instance could not be started.", error.message);
             }else{
                NotificationController.error("Your instance could not be started", "If the problem persists, please report the instance.");
             }
           }
         });
        })
      },

      reboot: function (instance) {
        var that = this;

        var modal = InstanceRebootModal();

        ModalHelpers.renderModal(modal, function () {
          // If user desires a hard reboot, need to pass an additional argument of reboot_type
          // action: "reboot"
          // reboot_type: "HARD"

          var instanceState = new InstanceState({status_raw: "active - rebooting"});
          var originalState = instance.get('state');
          instance.set({state: instanceState});
          Utils.dispatch(InstanceConstants.UPDATE_INSTANCE, {instance: instance});

          instance.reboot({
           success: function (model) {
             var instanceState = new InstanceState({status_raw: "active - rebooting"});
             instance.set({state: instanceState});

             Utils.dispatch(InstanceConstants.UPDATE_INSTANCE, {instance: instance});
             Utils.dispatch(InstanceConstants.POLL_INSTANCE, {instance: instance});
           },
           error: function (response) {
             instance.set({state: originalState});
             Utils.dispatch(InstanceConstants.UPDATE_INSTANCE, {instance: instance});
             Utils.dispatch(InstanceConstants.POLL_INSTANCE, {instance: instance});

             if(response && response.responseJSON && response.responseJSON.errors){
                var errors = response.responseJSON.errors;
                var error = errors[0];
                NotificationController.error("Instance could not be rebooted", error.message);
             }else{
                NotificationController.error("Instance could not be rebooted", "If the problem persists, please report the instance.");
             }
           }
         });
        });
      },

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
              var redirectUrl = URL.projectResources({project: project}, {relative: true});
              Backbone.history.navigate(redirectUrl, {trigger: true});
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
                ProjectInstanceActions.addInstanceToProject(instance, project);
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
            var redirectUrl = URL.projectResources({project: project}, {relative: true});
            Backbone.history.navigate(redirectUrl, {trigger: true});
          }
        })
      },

      requestImage: function(instance){
        var that = this;

        // instanceId, ipAddress
        var tags = stores.TagStore.getAll();

        var modal = InstanceImageModal({
          instance: instance,
          tags: tags
        });

        ModalHelpers.renderModal(modal, function (details) {
          var tagNames,
              requestData,
              providerId,
              identityId,
              requestUrl;

          tagNames = details.tags.map(function(tag){
            return tag.get('name');
          });

          requestData = {
            instance: instance.id,
            ip_address: instance.get("ip_address"),
            name: details.name,
            description: details.description,
            tags: tagNames,
            provider: details.providerId,
            software: details.software,
            exclude: details.filesToExclude,
            sys: details.systemFiles,
            vis: "public"
          };

          providerId = instance.getCreds().provider_id;
          identityId = instance.getCreds().identity_id;
          requestUrl = globals.API_ROOT + "/provider/" + providerId + "/identity/" + identityId + "/request_image" + globals.slash();

          $.ajax({
            url: requestUrl,
            type: 'POST',
            data: JSON.stringify(requestData),
            dataType: 'json',
            contentType: 'application/json',
            success: function (model) {
              NotificationController.info(null, "An image of your instance has been requested");
            },
            error: function (response, status, error) {
              if(response && response.responseJSON && response.responseJSON.errors){
                var errors = response.responseJSON.errors;
                var error = errors[0];
                NotificationController.error("An image of your instance could not be requested.", error.message);
              }else{
                NotificationController.error("An image of your instance could not be requested", "If the problem persists, please report the instance.");
              }
            }
          });
        })
      },

      reportInstance: function(instance){
        var that = this;

        var modal = InstanceReportModal({
          instance: instance
        });

        ModalHelpers.renderModal(modal, function (reportInfo) {
          var profile = stores.ProfileStore.get(),
              username = profile.get('username'),
              reportUrl = globals.API_ROOT + "/email/support" + globals.slash(),
              problemText = "",
              reportData = {};

          if(reportInfo.problems){
            _.each(reportInfo.problems, function(problem){
              problemText = problemText + "  -" + problem + "\n";
            })
          }

          reportData = {
            username: username,
            message: "Instance IP: " + instance.get('ip_address') + "\n" +
                     "Instance ID: " + instance.id + "\n" +
                     "Provider ID: " + instance.get('identity').provider + "\n" +
                     "\n" +
                     "Problems" + "\n" +
                     problemText + "\n" +
                     "Details \n" +
                     reportInfo.details + "\n",
            subject: "Atmosphere Instance Report from " + username
          };

          $.ajax({
            url: reportUrl,
            type: 'POST',
            data: JSON.stringify(reportData),
            dataType: 'json',
            contentType: 'application/json',
            success: function (model) {
              NotificationController.info(null, "Your instance report has been sent to support.");
            },
            error: function (response, status, error) {
              if(response && response.responseJSON && response.responseJSON.errors){
                var errors = response.responseJSON.errors;
                var error = errors[0];
                NotificationController.error("Your instance report could not be sent to support", error.message);
              }else{
                NotificationController.error("Your instance report could not be sent to support", "If the problem persists, please send an email to support@iplantcollaborative.org.");
              }
            }
          });
        })
      },

      _createAndAddToProjectNoModal: function(identity, machineId, sizeId, instanceName, project){
        var that = this;
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
            ProjectInstanceActions.addInstanceToProject(instance, project);
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
        var that = this;

        ModalHelpers.renderModal(modal, function (identity, machineId, sizeId, instanceName) {
          that._createAndAddToProjectNoModal(identity, machineId, sizeId, instanceName, project);
        });
      }

    };

  });
