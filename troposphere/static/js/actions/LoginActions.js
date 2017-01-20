import $ from "jquery";
import globals from "globals";
import { findCookie } from "utilities/cookieHelpers";

export default {

    openstackAuthSuccess: function(response, data, onSuccess, projectName, provider) {
        /**
         * When the API has authorized you, you will have an auth-token
         * use this auth-token to 'authorize' use of GUI
         */
        let auth_token = response.token,
            username = response.username;
        //Inject the atmosphere auth-token here
        data.token = response.token;

        let tropoLoginUrl = globals.TROPO_API_ROOT.replace("/tropo-api","/login");
        $.ajax(tropoLoginUrl, {
                type: "POST",
                data: JSON.stringify(data),
                dataType: "json",
                contentType: "application/json",
                success: function(response) {
                    // THIS token is only registered inside Troposphere. It is *NOT* the token that atmosphere will have on record.
                    let token = response.token,
                        username = response.username;

                    if(onSuccess != null) {
                        onSuccess(username, auth_token, projectName, provider);
                    }
                },
                error: function(response) {
                    var response_error = (response.responseJSON != null) ? response.responseJSON.errors[0].message : response.responseText;
                    if(onFailure != null) {
                        onFailure(response_error);
                    }
                }
            });
        return;
    },
    attemptPasswordLogin: function(username, password, onSuccess, onFailure) {
        var data = {};

        // Prepare POST data
        data["username"] = username;
        data["password"] = password;
        var loginUrl = globals.API_V2_ROOT.replace("/api/v2","/auth");

        let self = this;
        $.ajax(loginUrl, {
            type: "POST",
            data: JSON.stringify(data),
            dataType: "json",
            contentType: "application/json",
            success: function(response) {
                let token = response.token,
                    username = response.username,
                    data = {'username': username, 'password': password};
                self.passwordAuthSuccess(response, data, onSuccess, onFailure)
            },
            error: function(response) {
                var response_errors = response.responseJSON.errors;
                if(onFailure != null) {
                    onFailure(response_errors[0].message);
                }

            }
        });

    },
    passwordAuthSuccess: function(response, data, onSuccess, onFailure) {
        /**
         * When the API has authorized you, you will have an auth-token
         * use this auth-token to 'authorize' use of GUI
         */
        let auth_token = response.token,
            username = response.username;
        //Inject the atmosphere auth-token here
        data.token = response.token;

        let tropoLoginUrl = globals.TROPO_API_ROOT.replace("/tropo-api","/login");
        $.ajax(tropoLoginUrl, {
                type: "POST",
                data: JSON.stringify(data),
                dataType: "json",
                contentType: "application/json",
                success: function(response) {
                    // THIS token is only registered inside Troposphere. It is *NOT* the token that atmosphere will have on record.
                    let token = response.token,
                        username = response.username;

                    if(onSuccess != null) {
                        onSuccess(username, auth_token);
                    }
                },
                error: function(response) {
                    var response_error = (response.responseJSON != null) ? response.responseJSON.errors[0].message : response.responseText;
                    if(onFailure != null) {
                        onFailure(response_error);
                    }
                }
            });
        return;
    },
    attemptOpenstackLogin: function(username, password, projectName, provider, onSuccess, onFailure) {
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
                self.openstackAuthSuccess(response, data, onSuccess, projectName, provider)
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

