import $ from "jquery";
import React from "react";
import ReactDOM from "react-dom";
import actions from "actions";
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
        };
    },
    // High level logic
    attemptOAuthLogin: function() {
        window.location = '/login';
    },
    attemptPasswordLogin: function(username, password, onLoginError) {
        actions.LoginActions.attemptLogin(
            username, password,
            this.onLoginSuccess, onLoginError);
    },
    onLoginSuccess: function(username, token) {
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
        $("#main").addClass("splash-screen");

        var SplashScreenComponent = React.createFactory(SplashScreen);
        ReactDOM.render(SplashScreenComponent(), document.getElementById("application"));
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
           <div id="main" className="login-screen-master container" style={{"marginTop": "24px"}}>
                   <h2 className="t-headline">Login to Atmosphere:</h2>
                   {this.renderLoginMethod()}
           </div>
        );
    }

});
