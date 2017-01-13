import $ from "jquery";
import globals from "globals";

export default {
    attemptLogin: function(username, password, projectName, provider, onSuccess, onFailure) {
        var data = {};

        // Prepare POST data
        data["username"] = username;
        data["password"] = password;
        data["project_name"] = projectName;
        data["auth_url"] = provider != null ? provider.get('auth_url') : '';
        var loginUrl = globals.API_V2_ROOT.replace("/api/v2","/auth");

        $.ajax(loginUrl, {
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

    }
};

