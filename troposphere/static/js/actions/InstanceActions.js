define(
  [
    'dispatchers/AppDispatcher',
    'constants/InstanceConstants',
    'constants/ProjectInstanceConstants',
    'models/Instance',
    'models/InstanceState',
    'globals',
    'context',
    'url',
    './modalHelpers/InstanceModalHelpers',
    'controllers/NotificationController',
    'actions/ProjectInstanceActions'
  ],
  function (AppDispatcher, InstanceConstants, ProjectInstanceConstants, Instance, InstanceState, globals, context, URL, InstanceModalHelpers, NotificationController, ProjectInstanceActions) {

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
        var that = this;

        instance.set(newAttributes);
        that.dispatch(InstanceConstants.UPDATE_INSTANCE, {instance: instance});

        instance.save({
          name: instance.get('name'),
          tags: instance.get('tags')
        }, {
          patch: true
        }).done(function () {
          NotificationController.success(null, "Instance name and tags updated");
          that.dispatch(InstanceConstants.UPDATE_INSTANCE, {instance: instance});
        }).fail(function () {
          var message = "Error updating Instance " + instance.get('name') + ".";
          NotificationController.error(message);
          that.dispatch(InstanceConstants.UPDATE_INSTANCE, {instance: instance});
        });
      },

      addTagToInstance: function(tag, instance){
        var that = this;
        var instanceTags = instance.get('tags');
        instanceTags.push(tag.get('name'));

        instance.set({tags: instanceTags});
        that.dispatch(InstanceConstants.UPDATE_INSTANCE, {instance: instance});

        instance.save({
          tags: instanceTags
        }, {
          patch: true
        }).done(function () {
          that.dispatch(InstanceConstants.UPDATE_INSTANCE, {instance: instance});
        }).fail(function () {
          NotificationController.error(null, "Error adding tag to Instance");
          that.dispatch(InstanceConstants.UPDATE_INSTANCE, {instance: instance});
        });
      },

      _terminate: function(payload, options){
        var instance = payload.instance;
        var project = payload.project;
        var that = this;

        that.dispatch(InstanceConstants.REMOVE_INSTANCE, {instance: instance});

        instance.destroy().done(function () {
          NotificationController.success(null, 'Instance terminated');
          // poll until the instance is actually terminated
          //that.dispatch(InstanceConstants.POLL_INSTANCE, {instance: instance});
          ProjectInstanceActions.removeInstanceFromProject(instance, project);

        }).fail(function (response) {
          NotificationController.error(null, 'Instance could not be terminated');
          that.dispatch(InstanceConstants.ADD_INSTANCE, {instance: instance});
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

      // ----------------
      // Instance Actions
      // ----------------

      suspend: function (instance) {
        var that = this;

        var instanceState = new InstanceState({status_raw: "active - suspending"});
        instance.set({state: instanceState});
        that.dispatch(InstanceConstants.UPDATE_INSTANCE, {instance: instance});

        InstanceModalHelpers.suspend({
          instance: instance
        },{
          onConfirm: function () {

            var instanceState = new InstanceState({status_raw: "active - suspending"});
            instance.set({state: instanceState});
            that.dispatch(InstanceConstants.UPDATE_INSTANCE, {instance: instance});

            instance.suspend({
             success: function (model) {
               NotificationController.success(null, "Your instance is suspending...");

               var instanceState = new InstanceState({status_raw: "active - suspending"});
               instance.set({state: instanceState});

               that.dispatch(InstanceConstants.UPDATE_INSTANCE, {instance: instance});
               that.dispatch(InstanceConstants.POLL_INSTANCE, {instance: instance});
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

            var instanceState = new InstanceState({status_raw: "suspended - resuming"});
            instance.set({state: instanceState});
            that.dispatch(InstanceConstants.UPDATE_INSTANCE, {instance: instance});

            instance.resume({
             success: function (model) {
               NotificationController.success(null, "Your instance is resuming...");

               var instanceState = new InstanceState({status_raw: "suspended - resuming"});
               instance.set({state: instanceState});

               that.dispatch(InstanceConstants.UPDATE_INSTANCE, {instance: instance});
               that.dispatch(InstanceConstants.POLL_INSTANCE, {instance: instance});
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

            var instanceState = new InstanceState({status_raw: "active - powering-off"});
            instance.set({state: instanceState});
            that.dispatch(InstanceConstants.UPDATE_INSTANCE, {instance: instance});

            instance.stop({
             success: function (model) {
               NotificationController.success(null, "Your instance is stopping...");

               var instanceState = new InstanceState({status_raw: "active - powering-off"});
               instance.set({state: instanceState});

               that.dispatch(InstanceConstants.UPDATE_INSTANCE, {instance: instance});
               that.dispatch(InstanceConstants.POLL_INSTANCE, {instance: instance});
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

            var instanceState = new InstanceState({status_raw: "shutoff - powering-on"});
            instance.set({state: instanceState});
            that.dispatch(InstanceConstants.UPDATE_INSTANCE, {instance: instance});

            instance.start({
             success: function (model) {
               NotificationController.success(null, "Your instance is starting...");

               var instanceState = new InstanceState({status_raw: "shutoff - powering-on"});
               instance.set({state: instanceState});

               that.dispatch(InstanceConstants.UPDATE_INSTANCE, {instance: instance});
               that.dispatch(InstanceConstants.POLL_INSTANCE, {instance: instance});
             },
             error: function (response) {
               NotificationController.error(null, "Your instance could not be started");
             }
           });
          }
        });
      },

      launch: function(application){
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
            that.dispatch(ProjectInstanceConstants.ADD_PENDING_INSTANCE_TO_PROJECT, {
              instance: instance,
              project: project
            });

            instance.save(params, {
              success: function (model) {
                NotificationController.success(null, 'Instance launching...');
                that.dispatch(InstanceConstants.UPDATE_INSTANCE, {instance: instance});
                that.dispatch(InstanceConstants.POLL_INSTANCE, {instance: instance});
                that.dispatch(ProjectInstanceConstants.REMOVE_PENDING_INSTANCE_FROM_PROJECT, {
                  instance: instance,
                  project: project
                });
                ProjectInstanceActions.addInstanceToProject(instance, project);
              },
              error: function (response) {
                NotificationController.error(null, 'Instance could not be launched');
                that.dispatch(InstanceConstants.REMOVE_INSTANCE, {instance: instance});
                that.dispatch(ProjectInstanceConstants.REMOVE_PENDING_INSTANCE_FROM_PROJECT, {
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
            console.log(response.responseText);
            NotificationController.error(null, "An image of your instance could not be requested");
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
            NotificationController.info(null, "Your instance report has been sent to support.");
            var instanceUrl = URL.instance(instance);
            Backbone.history.navigate(instanceUrl, {trigger: true});
          },
          error: function (response, status, error) {
            console.log(response.responseText);
            NotificationController.error(null, "Your instance report could not be sent to support");
          }
        });
      }

    };

  });
