import $ from "jquery";
import actions from "actions";
import globals from "globals";
import React from "react";
import ReactDOM from "react-dom";
import NotificationController from "controllers/NotificationController";
import SplashScreen from "components/SplashScreen";
import { setCookie } from "utilities/cookieHelpers";
import PasswordLoginForm from "./PasswordLoginForm";
import OAuthLoginForm from "./OAuthLoginForm";

export default React.createClass({
    displayName: "LoginScreen",

    //
    // Mounting & State
    // ----------------
    //

    getDefaultProps: function() {
        return {
            method: window.login_auth_type || "token-login",
            login_from: "application",
        };
    },
    // High level logic
    attemptOAuthLogin: function() {
        window.location = '/login';
    },
    attemptPasswordLogin: function(username, password, projectName, provider, onLoginError) {
        actions.LoginActions.attemptLogin(
            username, password, projectName, provider,
            this.onLoginSuccess, onLoginError);
    },
    onLoginSuccess: function(username, token, project_name, provider) {
        //1. set window.access_token
        window.access_token = token;
        setCookie("auth_token", token);

        //2. re-init SplashScreen on 'application'

        let authHeaders = {
            "Content-Type": "application/json",
            "Authorization" : "Token " + window.access_token
        }

        // Make sure the Authorization header is added to every AJAX request
        $.ajaxSetup({
            headers: authHeaders
        });
        //FIXME: POST to Atmo with the latest token *BEFORE* you move on!
        let provider_uuid
        if(provider != null) {
            provider_uuid = provider.get('uuid')
        }
        var data = {username, token, project_name, provider: provider_uuid};
        var update_token_url = globals.API_V2_ROOT + "/token_update";
        var self = this;
        $.ajax(update_token_url, {
            type: "POST",
            data: JSON.stringify(data),
            dataType: "json",
            contentType: "application/json",
            success: self.renderAuthenticatedApplication,
            error: function(response) {
                var errorMessage,
                    response_error = response.responseJSON.detail;
                if (response.status >= 500) {
                    errorMessage = `Your login failed due to an unexpected error in the Atmosphere Auth Server. If you continue to see this message please email <a href='mailto:${globals.SUPPORT_EMAIL}'>${globals.SUPPORT_EMAIL}</a>.`;
                } else {
                    errorMessage = `There was an error saving new user token: ${response_error}`;
                }
                NotificationController.error("An error occured", errorMessage);
                self.renderAuthenticatedApplication();
            }
        });
    },
    renderAuthenticatedApplication: function(response) {
        if(this.props.login_from != "application") {
            //Post Refresh will render an authenticated application
            location.reload();
        } else {
            $("#main").addClass("splash-screen");

            var SplashScreenComponent = React.createFactory(SplashScreen);
            ReactDOM.render(SplashScreenComponent(), document.getElementById("application"));
        }
    },
    // Rendering
    renderLoginMethod: function() {
        if (this.props.method == "oauth-login") {
            return (<OAuthLoginForm 
                attemptLogin={this.attemptOAuthLogin}/>);
        } else {
            return (<PasswordLoginForm
                attemptLogin={this.attemptPasswordLogin}/>);
        }
    },
    render: function() {
        return (
           <div id="main" className="login-screen-master" style={{"marginTop": "24px"}}>
                   <h2 className="t-headline">Login to Atmosphere:</h2>
                   {this.renderLoginMethod()}
           </div>
        );
    }
});
