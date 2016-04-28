define(function (require) {
  "use strict";

  var stores = require('stores'),
    globals = require('globals'),
    $ = require('jquery'),
    _ = require('underscore'),
    Utils = require('../Utils');

  return {

    report: function (params) {
      if (!params.instance) throw new Error("Missing instance");
      if (!params.reportInfo) throw new Error("Missing reportInfo");

      let instance = params.instance,
          reportInfo = params.reportInfo;

      let reportData = {
        message:  reportInfo.details,
        instance: instance.id,
        problems: reportInfo.problems ? reportInfo.problems : [],
        ...Utils.browserContext()
      };

      $.ajax({
        url: globals.API_V2_ROOT + "/email_instance_report",
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
