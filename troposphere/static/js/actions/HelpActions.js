define(function (require) {

  var $ = require('jquery'),
      NotificationController = require('controllers/NotificationController'),
      globals = require('globals'),
      actions = require('actions'),
      stores = require('stores');

  return {

    sendFeedback: function (feedback) {
      var data = {};

      // The message from the use
      data["message"] = feedback;

      // Size information for the user's browser and monitor
      data['resolution'] = {
        'viewport': {
          'width': $(window).width(),
          'height': $(window).height()
        },
        'screen': {
          'width': screen.width,
          'height': screen.height
        }
      };

      var feedbackUrl = globals.API_ROOT + '/email/feedback';

      $.ajax(feedbackUrl, {
        type: 'POST',
        data: JSON.stringify(data),
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
          NotificationController.info("Thanks for your feedback!", "Support has been notified.");
        },
        error: function (response_text) {
          var errorMessage = "Your feedback could not be submitted. If you'd like to send it directly to support, email <a href='mailto:support@iplantcollaborative.org'>support@iplantcollaborative.org</a>.";
          NotificationController.error("An error occured", errorMessage);
        }
      });

    },

    requestMoreResources: function (params) {
      if (!params.identity) throw new Error("Missing identity");
      if (!params.quota) throw new Error("Missing quota");
      if (!params.reason) throw new Error("Missing reason");

      actions.BadgeActions.askSupport();


      var user = stores.ProfileStore.get(),
        identity = params.identity,
        quota = params.quota,
        reason = params.reason,
        username = user.get('username');

      var data = {
        identity: identity,
        request: quota,
        description: reason
      };

      var requestUrl = globals.API_V2_ROOT + '/resource_requests';

      $.ajax(requestUrl, {
        type: 'POST',
        data: JSON.stringify(data),
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
          NotificationController.info("Resource Request submitted", "Support will be in touch with you shortly.");
          actions.BadgeActions.askSupport();
        },
        error: function (response_text) {
          var errorMessage = "An error occured while submitting your request for more resources.  Please email your resources request to <a href='mailto:support@iplantcollaborative.org'>support@iplantcollaborative.org</a>.";
          NotificationController.error("Request resources error", errorMessage);
        }
      });

    }

  };

});
