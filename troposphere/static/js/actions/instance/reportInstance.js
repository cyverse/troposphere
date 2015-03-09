define(function (require) {
  "use strict";

  var globals = require('globals'),
      NotificationController = require('controllers/NotificationController'),
      stores = require('stores'),
      ModalHelpers = require('components/modals/ModalHelpers'),
      InstanceReportModal = require('components/modals/instance/InstanceReportModal.react'),
      Utils = require('../Utils');

  return {
    reportInstance: function(instance){
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
    }
  };

});
