define(
  [
    'dispatchers/AppDispatcher',
    'constants/InstanceConstants',
    'react',
    'globals',
    'context',
    'controllers/NotificationController',
    'url',
    './modalHelpers/InstanceModalHelpers',
    'constants/ProjectInstanceConstants',
    'models/Instance'
  ],
  function (AppDispatcher, InstanceConstants, React, globals, context, NotificationController, URL, InstanceModalHelpers, ProjectInstanceConstants, Instance) {

    return {

      dispatch: function(actionType, payload, options){
        options = options || {};
        AppDispatcher.handleRouteAction({
          actionType: actionType,
          payload: payload,
          options: options
        });
      },

      // ------------------------
      // Standard CRUD Operations
      // ------------------------

      updateInstanceAttributes: function (instance, newAttributes) {

        // var update = function(instance){
        //   instance.save({
        //     name: instance.get('name'),
        //     tags: instance.get('tags')
        //   }, {
        //     patch: true
        //   }).done(function(){
        //     var successMessage = "Instance " + instance.get('name') + " updated.";
        //     //NotificationController.success(successMessage);
        //     InstanceStore.emitChange();
        //   }).fail(function(){
        //     var failureMessage = "Error updating Instance " + instance.get('name') + ".";
        //     NotificationController.error(failureMessage);
        //     InstanceStore.emitChange();
        //   });
        // };

        instance.set(newAttributes);
        AppDispatcher.handleRouteAction({
          actionType: InstanceConstants.INSTANCE_UPDATE,
          instance: instance
        });
      },

      addTagToInstance: function(tag, instance){

        // var addTagToInstance = function(tag, instance){
        //   var instanceTags = instance.get('tags');
        //   instanceTags.push(tag.get('name'));
        //   instance.save({
        //     tags: instanceTags
        //   }, {
        //     patch: true
        //   }).done(function(){
        //     InstanceStore.emitChange();
        //   }).fail(function(){
        //     var failureMessage = "Error adding tag to Instance";
        //     NotificationController.error(failureMessage);
        //     InstanceStore.emitChange();
        //   });
        // };

        AppDispatcher.handleRouteAction({
          actionType: InstanceConstants.INSTANCE_ADD_TAG,
          tag: tag,
          instance: instance
        });
      },

      suspend: function (instance) {
        var that = this;

        InstanceModalHelpers.suspend({
          instance: instance
        },{
          onConfirm: function () {
            instance.suspend({
             success: function (model) {
               NotificationController.success(null, "Your instance is suspending...");
               //pollUntilBuildIsFinished(instance);
               that.dispatch(InstanceConstants.UPDATE_INSTANCE, {instance: instance});
             },
             error: function (response) {
               NotificationController.error(null, "Your instance could not be suspended");
             }
           });
          }
        });
      },

      resume: function(instance){
        var that = this;

        InstanceModalHelpers.resume({
          instance: instance
        },{
          onConfirm: function () {
            instance.resume({
             success: function (model) {
               NotificationController.success(null, "Your instance is resuming...");
               //pollUntilBuildIsFinished(instance);
               that.dispatch(InstanceConstants.UPDATE_INSTANCE, {instance: instance});
             },
             error: function (response) {
               NotificationController.error(null, "Your instance could not be resumed");
             }
           });
          }
        });
      },

      stop: function(instance){
        var that = this;

        InstanceModalHelpers.stop({
          instance: instance
        },{
          onConfirm: function () {
            instance.stop({
             success: function (model) {
               NotificationController.success(null, "Your instance is stopping...");
               //pollUntilBuildIsFinished(instance);
               that.dispatch(InstanceConstants.UPDATE_INSTANCE, {instance: instance});
             },
             error: function (response) {
               NotificationController.error(null, "Your instance could not be stopped");
             }
           });
          }
        });
      },

      start: function(instance){
        var that = this;

        InstanceModalHelpers.start({
          instance: instance
        },{
          onConfirm: function () {
            instance.start({
             success: function (model) {
               NotificationController.success(null, "Your instance is starting...");
               //pollUntilBuildIsFinished(instance);
               that.dispatch(InstanceConstants.UPDATE_INSTANCE, {instance: instance});
             },
             error: function (response) {
               NotificationController.error(null, "Your instance could not be started");
             }
           });
          }
        });
      },

      _terminate: function(payload, options){
        var instance = payload.instance;
        var project = payload.project;
        var that = this;

        // todo: change instance state to show that it's being terminated

        instance.destroy().done(function () {
          NotificationController.success(null, 'Instance terminated');

          that.dispatch(InstanceConstants.REMOVE_INSTANCE, {instance: instance});

          // todo: the proper thing to do is to poll until the instance is actually terminated
          // and THEN remove it from the project. Need to add a callback to support that.
          // InstanceStore.pollUntilFinalState(instance);
          that.dispatch(ProjectInstanceConstants.REMOVE_INSTANCE_FROM_PROJECT, {
            instance: instance,
            project: project
          });

        }).fail(function (response) {
          NotificationController.error(null, 'Instance could not be terminated');
          //that.dispatch(InstanceConstants.ADD_INSTANCE, {instance: instance});
        });
      },

      terminate: function(payload, options){
        var instance = payload.instance;
        var redirectUrl = payload.redirectUrl;
        var project = payload.project;
        var that = this;

        InstanceModalHelpers.terminate({
          instance: instance
        },{
          onConfirm: function () {
            that._terminate(payload, options);
            if(redirectUrl) Backbone.history.navigate(redirectUrl, {trigger: true});
          }
        });
      },

      terminate_noModal: function(payload, options){
        this._terminate(payload, options);
      },

      launch: function(application){



        // var launch_AddToProject = function(identity, machineId, sizeId, instanceName, project){
        //   launch(identity, machineId, sizeId, instanceName, {
        //     afterCreate: function(instance){
        //       _pendingProjectInstances[project.id] = _pendingProjectInstances[project.id] || new InstanceCollection();
        //       _pendingProjectInstances[project.id].add(instance);
        //     },
        //     afterSave: function(instance){
        //       _pendingProjectInstances[project.id].remove(instance);
        //       ProjectActions.addItemToProject(project, instance);
        //     },
        //     afterSaveError: function(instance){
        //       _pendingProjectInstances[project.id].remove(instance);
        //     }
        //   })
        // };

        var that = this;

        InstanceModalHelpers.launch({
          application: application
        },{
          onConfirm: function (identity, machineId, sizeId, instanceName, project) {
            var instance = new Instance({
              identity: {
                id: identity.id,
                provider: identity.get('provider_id')
              },
              status: "build - scheduling"
            }, {parse: true});

            var params = {
              machine_alias: machineId,
              size_alias: sizeId,
              name: instanceName
            };

            that.dispatch(InstanceConstants.ADD_INSTANCE, {instance: instance});
            that.dispatch(ProjectInstanceConstants.ADD_INSTANCE_TO_PROJECT, {
              instance: instance,
              project: project
            });

            instance.save(params, {
              success: function (model) {
                NotificationController.success(null, 'Instance launching...');
                that.dispatch(InstanceConstants.UPDATE_INSTANCE, {instance: instance});
                //pollUntilBuildIsFinished(instance);
              },
              error: function (response) {
                NotificationController.error(null, 'Instance could not be launched');
                that.dispatch(InstanceConstants.REMOVE_INSTANCE, {instance: instance});
                that.dispatch(ProjectInstanceConstants.REMOVE_INSTANCE_FROM_PROJECT, {
                  instance: instance,
                  project: project
                });
              }
            });

            // Since this is triggered from the images page, navigate off
            // that page and back to the instance list so the user can see
            // their instance being created
            var redirectUrl = URL.project(project, {relative: true});
            Backbone.history.navigate(redirectUrl, {trigger: true});
          }
        });
      },

      requestImage: function(instance, requestData){
        var providerId = instance.getCreds().provider_id;
        var identityId = instance.getCreds().identity_id;
        var requestUrl = globals.API_ROOT + "/provider/" + providerId + "/identity/" + identityId + "/request_image" + globals.slash();

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
            NotificationController.error(null, response.responseText);
          }
        });
      },

      reportInstance: function(instance, reportInfo){
        var reportUrl = globals.API_ROOT + "/email/support" + globals.slash();

        var problemText = "";
        if(reportInfo.problems){
          _.each(reportInfo.problems, function(problem){
            problemText = problemText + "  -" + problem + "\n";
          })
        }

        var username = context.profile.get('username');

        var reportData = {
          username: username,
          message: "Instance IP: " + instance.get('ip_address') + "\n" +
                   "Instance ID: " + instance.id + "\n" +
                   "Provider ID: " + instance.get('identity').provider + "\n" +
                   "\n" +
                   "Problems" + "\n" +
                   problemText + "\n" +
                   "Message \n" +
                   reportInfo.message + "\n",
          subject: "Atmosphere Instance Report from " + username
        };

        $.ajax({
          url: reportUrl,
          type: 'POST',
          data: JSON.stringify(reportData),
          dataType: 'json',
          contentType: 'application/json',
          success: function (model) {
            NotificationController.info(null, "Your instance problems have been sent to support.");
            var instanceUrl = URL.instance(instance);
            Backbone.history.navigate(instanceUrl, {trigger: true});
          },
          error: function (response, status, error) {
            NotificationController.error(null, response.responseText);
          }
        });
      }

    };

  });
