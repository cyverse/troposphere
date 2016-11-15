import $ from "jquery";
import React from "react";
import ReactDOM from "react-dom";
import context from "context";
import Router from "../Router";
import routes from "../AppRoutes";
import actions from "actions";
import SplashScreen from "components/SplashScreen";
import { setCookie } from "utilities/cookieHelpers";

export default React.createClass({
    displayName: "LoginScreen",

    //
    // Mounting & State
    // ----------------
    //

    getInitialState: function() {
        return {
            method: "",
            username: "",
            password: ""
        };
    },
    onUsernameChange: function(e) {
        var input = e.target.value.trim();
        this.setState({
            username: input
        });
    },

    onPasswordChange: function(e) {
        var input = e.target.value;
        this.setState({
            password: input
        });
    },

    isSubmittable: function() {
        var hasUsername = !!this.state.username && this.state.username.length > 0;
        var hasPassword = !!this.state.password && this.state.password.length > 0;
        return hasUsername && hasPassword;
    },

    attemptLogin: function() {
        actions.LoginActions.attemptLogin(
            this.state.username, this.state.password,
            this.onLoginSuccess, this.onLoginError);
    },
    onLoginError: function(err_response) {
        this.setState({
            error_message: err_response
        });
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
        $("body").addClass("splash-screen");

        var SplashScreenComponent = React.createFactory(SplashScreen);
        ReactDOM.render(SplashScreenComponent(), document.getElementById("application"));
    },
    render: function() {
        $("body").removeClass("splash-screen");

        let usernameClasses = "form-group",
            passwordClasses = "form-group",
            errorMessage = this.state.error_message != null ? "Login Failed: "+ this.state.error_message : null;

        return (
        <div className="login-screen-master">
            <h2 className="t-headline">No Token Found! Please login to Atmosphere:</h2>
            <form>
                <div className={usernameClasses}>
                    <label htmlFor="username">
                        Username
                    </label>
                    <input required
                        type="name"
                        className="form-control"
                        id="username"
                        value={this.state.username}
                        ref="usernameInput"
                        onChange={this.onUsernameChange}
                        />
                </div>
                <div className={passwordClasses}>
                    <label htmlFor="password">
                        Password
                    </label>
                    <input required
                        type="password"
                        className="form-control"
                        id="password"
                        value={this.state.password}
                        ref="passwordInput"
                        onChange={this.onPasswordChange}
                        />
                </div>
                <div className="login-screen-footer">
                    <button type="button"
                        className="btn btn-primary"
                        onClick={this.attemptLogin}
                        disabled={!this.isSubmittable()}>
                        Login to Atmosphere
                    </button>
                    <span className="help-block">{errorMessage}</span>
                </div>
            </form>
        </div>
        );
    }

});
