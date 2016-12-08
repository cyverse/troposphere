import $ from "jquery";
import globals from "globals";

export default {
    attemptLogin: function(username, password, onSuccess, onFailure) {
        var data = {};

        // Prepare POST data
        data["username"] = username;
        data["password"] = password;
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
                    onSuccess(username, token);
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

