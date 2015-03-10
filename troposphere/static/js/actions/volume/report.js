define(function (require) {

  var NotificationController = require('controllers/NotificationController'),
      stores = require('stores'),
      globals = require('globals'),
      ModalHelpers = require('components/modals/ModalHelpers'),
      VolumeReportModal = require('components/modals/volume/VolumeReportModal.react'),
      Utils = require('../Utils');

  return {

    report: function(volume){
      var modal = VolumeReportModal({
        volume: volume
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
          message: "Volume ID: " + volume.id + "\n" +
                   "Provider ID: " + volume.get('identity').provider + "\n" +
                   "\n" +
                   "Problems" + "\n" +
                   problemText + "\n" +
                   "Details \n" +
                   reportInfo.details + "\n",
          subject: "Atmosphere Volume Report from " + username
        };

        $.ajax({
          url: reportUrl,
          type: 'POST',
          data: JSON.stringify(reportData),
          dataType: 'json',
          contentType: 'application/json',
          success: function (model) {
            NotificationController.info(null, "Your volume report has been sent to support.");
          },
          error: function (response, status, error) {
            NotificationController.error(null, "Your volume report could not be sent to support");
          }
        });
      })
    }

  };

});
