
import stores from 'stores';
import globals from 'globals';
import $ from 'jquery';
import _ from 'underscore';
import Utils from '../Utils';

export default {

    report: function(params) {
        if (!params.reportInfo) throw new Error("Missing reportInfo");
        if (!params.volume) throw new Error("Missing volume");

        var profile = stores.ProfileStore.get(),
            username = profile.get('username'),
            reportUrl = globals.API_ROOT + "/email/support",
            problemText = "",
            reportInfo = params.reportInfo,
            reportData = {},
            volume = params.volume;

        if (reportInfo.problems) {
            _.each(reportInfo.problems, function(problem) {
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
            subject: "Atmosphere Volume Report from " + username,
            "user-interface": 'troposphere'
        };

        $.ajax({
            url: reportUrl,
            type: 'POST',
            data: JSON.stringify(reportData),
            dataType: 'json',
            contentType: 'application/json',
            success: function() {
                Utils.displayInfo({
                    message: "We're sorry to hear you're having trouble with your volume. Your report has " +
                        "been sent to support and someone will contact you through email to help resolve your issue."
                });
            },
            error: function(response, status, error) {
                Utils.displayError({
                    title: "Your volume report could not be sent",
                    response: response
                });
            }
        });
    }

};
