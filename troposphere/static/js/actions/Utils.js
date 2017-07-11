import AppDispatcher from "dispatchers/AppDispatcher";
import NotificationController from "controllers/NotificationController";
import $ from "jquery";

export default {

    dispatch: function(actionType, payload, options) {
        options = options || {};
        AppDispatcher.handleRouteAction({
            actionType: actionType,
            payload: payload,
            options: options
        });
    },

    displayInfo: function(options) {
        if (!options.message)
            throw new Error("Missing message");
        NotificationController.info(null, options.message);
    },
    // Size information for the user's browser and monitor
    browserContext: function() {
        return {
            "window-width": $(window).width(),
            "window-height": $(window).height(),
            "screen-width": screen.width,
            "screen-height": screen.height,
            "user-interface": "troposphere"
        };

    },

    displaySuccess: function(options) {
        if (!options.message)
            throw new Error("Missing message");
        NotificationController.success(null, options.message);
    },

    displayError: function(options) {
        var response = options.response,
            title = options.title;
        try {
            let error, raw_error,
                error_json = (response.responseJSON != null) ? response.responseJSON : null,
                error_msg = response.responseText;
            if(error_json != null) {
                if ("detail" in error_json) {
                    raw_error = error_json.detail;
                    error = {
                        "code": response.status,
                        "message": "Encountered the following errors:" + JSON.stringify(raw_error)
                    };
                } else if ("errors" in error_json) {
                    raw_error = error_json.errors[0];
                    if('code' in raw_error && 'message' in raw_error) {
                        //Properly formed error
                        error = raw_error;
                    } else {
                        //Safety -- if syntax changes
                        error = {
                            "code": response.status,
                            "message": "Encountered the following errors:" + JSON.stringify(raw_error)
                        };
                    }
                } else {
                    //Safety -- if 'errors' isn't available
                    error = {
                        "code": response.status,
                        "message": "Encountered the following errors:" + JSON.stringify(error_json)
                    };
                }
            } else if(error_msg != null) {
                //Safety -- when no JSON is given in the response
                error = {
                    "code": response.status,
                    "message": error_msg
                }
            } else {
                //Safety -- when response contains no body
                error = {
                    "code": 0,
                    "message": "API Error - Connection Refused"
                }
            }

            NotificationController.error(
                title,
                error.code + ": " + error.message
            );
            return error;
        } catch (err) {
            NotificationController.error(
                title,
                "If the problem persists, please contact support."
            );
        }
    }
};
