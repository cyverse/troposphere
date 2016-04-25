define(function (require) {
  "use strict";

  var stores = require('stores'),
    globals = require('globals'),
    $ = require('jquery'),
    _ = require('underscore'),
    Utils = require('../Utils');

  return {

    report: function (params) {
      if (!params.reportInfo) throw new Error("Missing reportInfo");
      if (!params.volume) throw new Error("Missing volume");

      let volume = params.volume,
          reportInfo = params.reportInfo;

      let reportData = {
        message:  reportInfo.details,
        volume: volume.id,
        problems: reportInfo.problems ? reportInfo.problems : [],
        ...Utils.browserContext()
      };

      $.ajax({
        url: globals.API_V2_ROOT + "/email_volume_report",
        type: 'POST',
        data: JSON.stringify(reportData),
        dataType: 'json',
        contentType: 'application/json',
        success: function () {
          Utils.displayInfo({
            message: "We're sorry to hear you're having trouble with your volume. Your report has " +
            "been sent to support and someone will contact you through email to help resolve your issue."
          });
        },
        error: function (response, status, error) {
          Utils.displayError({title: "Your volume report could not be sent", response: response});
        }
      });
    }

  };

});
