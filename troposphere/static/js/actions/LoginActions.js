import $ from "jquery";
import globals from "globals";
import { findCookie } from "utilities/cookieHelpers";

export default {

    authSuccess: function(response, data, onSuccess, projectName, provider) {
        /**
         * When the API has authorized you, allow the UI to authorize you
         */
        let token = response.token,
            username = response.username;
        let tropoLoginUrl = globals.API_V2_ROOT.replace("/api/v2","/login");
        $.ajax(tropoLoginUrl, {
                type: "POST",
                data: JSON.stringify(data),
                dataType: "json",
                contentType: "application/json",
                success: function(response) {
                    let token = response.token,
                        username = response.username;

                    if(onSuccess != null) {
                        onSuccess(username, token, projectName, provider);
                    }
                },
                error: function(response) {
                    var response_errors = response.responseJSON.errors;
                    if(onFailure != null) {
                        onFailure(response_errors[0].message);
                    }
                }
            });
        return;
    },

    attemptLogin: function(username, password, projectName, provider, onSuccess, onFailure) {
        var data = {};

        // var CSRFToken = findCookie("tropo_csrftoken");
        // data["csrfmiddlewaretoken"] = CSRFToken;
        // Prepare POST data
        data["username"] = username;
        data["password"] = password;
        data["project_name"] = projectName;
        data["auth_url"] = provider != null ? provider.get('auth_url') : '';
        let authUrl = globals.API_V2_ROOT.replace("/api/v2","/auth");
        let self = this;
        $.ajax(authUrl, {
            type: "POST",
            data: JSON.stringify(data),
            dataType: "json",
            contentType: "application/json",
            success: function(response) {
                self.authSuccess(response, data, onSuccess, projectName, provider)
            },
            error: function(response) {
                var response_errors = response.responseJSON.errors;
                if(onFailure != null) {
                    onFailure(response_errors[0].message);
                }
            }
        });

    }
};

