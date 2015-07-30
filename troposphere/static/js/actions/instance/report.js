define(function (require) {
  "use strict";

  var stores = require('stores'),
    globals = require('globals'),
    Utils = require('../Utils');

  return {

    report: function (params) {
      if (!params.instance) throw new Error("Missing instance");
      if (!params.reportInfo) throw new Error("Missing reportInfo");

      var instance = params.instance,
        reportInfo = params.reportInfo;

      var profile = stores.ProfileStore.get(),
        username = profile.get('username'),
        reportUrl = globals.API_ROOT + "/email/support",
        problemText = "",
        reportData = {};

      if (reportInfo.problems) {
        _.each(reportInfo.problems, function (problem) {
          problemText = problemText + "  -" + problem + "\n";
        })
      }

      reportData = {
        username: username,
        message: "Instance IP: " + instance.get('ip_address') + "\n" +
        "Instance ID: " + instance.id + "\n" +
        "Provider ID: " + instance.get('provider').id + "\n" +
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
        success: function () {
          Utils.displayInfo({
            message: "We're sorry to hear you're having trouble with your instance. Your report has " +
            "been sent to support and someone will contact you through email to help resolve your issue."
          });
        },
        error: function (response, status, error) {
          Utils.displayError({title: "Your instance report could not be sent", response: response});
        }
      });
    }

  };

});
