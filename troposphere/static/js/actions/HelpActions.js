define(
  [
    'react',
    'jquery',
    'controllers/NotificationController',
    'globals',
    'components/modals/FeedbackModal.react'
  ],
  function (React, $, NotificationController, globals, FeedbackModal) {

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

      showFeedbackModal: function(){

        var onConfirm = function (feedback) {
          this.sendFeedback(feedback);
        }.bind(this);

        var onCancel = function(){
          // Important! We need to un-mount the component so it un-registers from Stores and
          // also so that we can relaunch it again later.
          React.unmountComponentAtNode(document.getElementById('modal'));
        };

        var modal = FeedbackModal({
          header: "Send Feedback",
          confirmButtonMessage: "Send feedback",
          onConfirm: onConfirm,
          onCancel: onCancel,
          handleHidden: onCancel
        });

        React.render(modal, document.getElementById('modal'));
      }

    };

  });
