import $ from "jquery";

import NotificationController from "controllers/NotificationController";
import globals from "globals";
import Utils from "./Utils";
import ResourceRequestConstants from "constants/ResourceRequestConstants";
import AdminResourceRequestConstants from "constants/AdminResourceRequestConstants";
import actions from "actions";

export default {
    sendFeedback: function(feedback) {
        var data = {};

        // The message from the use
        data["message"] = feedback;

        // Size information for the user's browser and monitor
        data["resolution"] = {
            "viewport": {
                "width": $(window).width(),
                "height": $(window).height()
            },
            "screen": {
                "width": screen.width,
                "height": screen.height
            }
        };

        data["user-interface"] = "troposphere";

        var feedbackUrl = globals.API_V2_ROOT + "/email_feedback";

        $.ajax(feedbackUrl, {
            type: "POST",
            data: JSON.stringify(data),
            dataType: "json",
            contentType: "application/json",
            success: function() {
                NotificationController.info("Thanks for your feedback!", "Support has been notified.");
            },
            error: function(response) {
                var errorMessage,
                    response_error = response.responseJSON.detail;
                if (response.status >= 500) {
                    errorMessage = `Your feedback could not be submitted. If you'd like to send it directly to support, email <a href='mailto:${globals.SUPPORT_EMAIL}'>${globals.SUPPORT_EMAIL}</a>.`;
                } else {
                    errorMessage = "There was an error submitting your request: " + response_error;
                }
                NotificationController.error("An error occured", errorMessage);
            }
        });

    },

    requestMoreResources: function(params) {
        if (!params.quota)
            throw new Error("Missing quota");
        if (!params.reason)
            throw new Error("Missing reason");

        if (globals.BADGES_ENABLED) {
            actions.BadgeActions.askSupport();
        }

        let admin_url = window.location.origin + "/application/admin/resource-requests/";
        let data = {
            request: params.quota,
            description: params.reason,
            admin_url: admin_url
        };

        let requestUrl = globals.API_V2_ROOT + "/resource_requests";

        $.ajax(requestUrl, {
            type: "POST",
            data: JSON.stringify(data),
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                NotificationController.info("Resource Request submitted", "Support will be in touch with you shortly.");
                Utils.dispatch(ResourceRequestConstants.ADD, {
                    model: data
                });
                Utils.dispatch(AdminResourceRequestConstants.ADD, {
                    model: data
                });
            },
            error: function(response) {
                var errorMessage,
                    response_error = response.responseJSON.detail;
                if (response.status >= 500) {
                    errorMessage = "Your feedback could not be submitted. If you'd like to send it directly to support, email <a href='mailto:support@iplantcollaborative.org'>support@iplantcollaborative.org</a>.";
                } else {
                    errorMessage = "There was an error submitting your request: " + response_error;
                }
                NotificationController.error("Request resources error", errorMessage);
            }
        });

    }

};
