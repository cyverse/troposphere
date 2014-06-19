define(
  [
    'jquery',
    'controllers/NotificationController',
    'globals'
  ],
  function ($, NotificationController, globals) {

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

        var feedbackUrl = globals.API_ROOT + '/email/feedback' + globals.slash();

        $.ajax(feedbackUrl, {
          type: 'POST',
          data: data,
          success: function (data) {
            NotificationController.info("Thanks for your feedback!", "Support has been notified.");
          },
          error: function (response_text) {
            var errorMessage = "Your feedback could not be submitted. If you'd like to send it directly to support, email <a href='mailto:support@iplantcollaborative.org'>support@iplantcollaborative.org</a>.";
            NotificationController.error("An error occured", errorMessage);
          }
        });

      }

    };

  });
