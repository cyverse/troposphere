/*
 * Utilities for contacting support via email
 */
define(
  [
    'jquery',
    'underscore',
    'rsvp',
    'controllers/NotificationController'
  ],
  function ($, _, RSVP, NotificationController) {

    // models/Instance instance
    // [string] problems
    // string description
    // TODO: Send along running instances and volumes
    function reportInstance(username, instance, problems, description) {
      var subject = "Atmosphere Instance Report from " + username;
      var body = "Something is terribly wrong.\n\n";
      body += description;
      return sendEmail(username, subject, body);
    }

    function collectWindowState() {
      var data = {};
      data.location = window.location.href,
        data.resolution = {
          viewport: {
            width: $(window).width(),
            height: $(window).height()
          },
          screen: {
            width: screen.width,
            height: screen.height
          }
        };
      return data;
    }

    function sendEmail(username, subject, body) {
      var data = {
        username: username,
        subject: subject,
        message: body
      };
      _.extend(data, collectWindowState());

      return new RSVP.Promise(function (resolve, reject) {
        $.ajax({
          type: 'POST',
          url: '/api/v1/email/support/',
          data: data,
          success: function () {
            NotificationController.success("Your report has been sent to support", "Reports are typically answered in one to two business days.");
            resolve();
          },
          error: function () {
            NotificationController.danger('Could not send report', 'Please email your issue directly to <a href="mailto:support@iplantcollaborative.org">support@iplantcollaborative.org</a>.');
            reject();
          }
        });
      });
    }

    return {
      reportInstance: reportInstance
    };

  });
