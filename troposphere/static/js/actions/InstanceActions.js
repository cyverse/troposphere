define(
  [
    'dispatchers/AppDispatcher',
    'constants/InstanceConstants',
    'react',
    'globals',
    'context',
    'controllers/NotificationController',
    'components/modals/CancelConfirmModal.react',
    'components/modals/InstanceSuspendBody.react',
    'components/modals/InstanceResumeBody.react',
    'components/modals/InstanceStopBody.react',
    'components/modals/InstanceStartBody.react',
    'components/modals/InstanceTerminateBody.react',
    'components/modals/InstanceLaunchModal.react',
    'url'
  ],
  function (AppDispatcher, InstanceConstants, React, globals, context, NotificationController, CancelConfirmModal, InstanceSuspendBody, InstanceResumeBody, InstanceStopBody, InstanceStartBody, InstanceTerminateBody, InstanceLaunchModal, URL) {

    return {
      updateInstanceAttributes: function (instance, newAttributes) {
        instance.set(newAttributes);
        AppDispatcher.handleRouteAction({
          actionType: InstanceConstants.INSTANCE_UPDATE,
          instance: instance
        });
      },

      suspend: function (instance) {

        var onConfirm = function () {
          AppDispatcher.handleRouteAction({
            actionType: InstanceConstants.INSTANCE_SUSPEND,
            instance: instance
          });
        };

        var modal = CancelConfirmModal({
          header: "Suspend Instance",
          confirmButtonMessage: "Suspend Instance",
          onConfirm: onConfirm,
          body: InstanceSuspendBody.build()
        });

        React.renderComponent(modal, document.getElementById('modal'));
      },

      resume: function(instance){

        var onConfirm = function () {
          AppDispatcher.handleRouteAction({
            actionType: InstanceConstants.INSTANCE_RESUME,
            instance: instance
          });
        };

        var modal = CancelConfirmModal({
          header: "Resume Instance",
          confirmButtonMessage: "Resume Instance",
          onConfirm: onConfirm,
          body: InstanceResumeBody.build()
        });

        React.renderComponent(modal, document.getElementById('modal'));
      },

      stop: function(instance){

        var onConfirm = function () {
          AppDispatcher.handleRouteAction({
            actionType: InstanceConstants.INSTANCE_STOP,
            instance: instance
          });
        };

        var modal = CancelConfirmModal({
          header: "Stop Instance",
          confirmButtonMessage: "Stop Instance",
          onConfirm: onConfirm,
          body: InstanceStopBody.build()
        });

        React.renderComponent(modal, document.getElementById('modal'));
      },

      start: function(instance){

        var onConfirm = function () {
          AppDispatcher.handleRouteAction({
            actionType: InstanceConstants.INSTANCE_START,
            instance: instance
          });
        };

        var modal = CancelConfirmModal({
          header: "Start Instance",
          confirmButtonMessage: "Start Instance",
          onConfirm: onConfirm,
          body: InstanceStartBody.build()
        });

        React.renderComponent(modal, document.getElementById('modal'));
      },

      terminate: function(instance){

        var onConfirm = function () {
          AppDispatcher.handleRouteAction({
            actionType: InstanceConstants.INSTANCE_TERMINATE,
            instance: instance
          });
          // Since this is triggered from the instance details page, navigate off
          // that page and back to the instance list
          Backbone.history.navigate('instances', {trigger: true});
        };

        var modal = CancelConfirmModal({
          header: "Are you sure you want to terminate this instance?",
          confirmButtonMessage: "Yes, terminate this instance",
          onConfirm: onConfirm,
          body: InstanceTerminateBody.build(instance)
        });

        React.renderComponent(modal, document.getElementById('modal'));
      },

      launch: function(application){

        var onConfirm = function (identity, machineId, sizeId, instanceName, project) {
          AppDispatcher.handleRouteAction({
            actionType: InstanceConstants.INSTANCE_LAUNCH,
            identity: identity,
            machineId: machineId,
            sizeId: sizeId,
            instanceName: instanceName,
            project: project
          });
          // Since this is triggered from the images page, navigate off
          // that page and back to the instance list so the user can see
          // their instance being created
          Backbone.history.navigate('instances', {trigger: true});
        };

        var onCancel = function(){
          // Important! We need to un-mount the component so it un-registers from Stores and
          // also so that we can relaunch it again later.
          React.unmountComponentAtNode(document.getElementById('modal'));
        };

        var modal = InstanceLaunchModal({
          header: application.get('name'),
          application: application,
          confirmButtonMessage: "Launch instance",
          onConfirm: onConfirm,
          onCancel: onCancel,
          handleHidden: onCancel
        });

        React.renderComponent(modal, document.getElementById('modal'));
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
