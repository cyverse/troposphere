import $ from "jquery";
import React from "react";
import ReactDOM from "react-dom";
import context from "context";
import globals from "globals";
import Router from "../Router";
import routes from "../AppRoutes";
import actions from "actions";
import SplashScreen from "components/SplashScreen";
import { setCookie } from "utilities/cookieHelpers";
import LoginHeader from "./LoginHeader";
import Footer from "./Footer";

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

    onEnterPressed: function(e) {
        if (e.key === 'Enter' && this.isSubmittable()) {
            this.attemptLogin()
        }
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
    onLoginError: function(error_message) {
        this.setState({
            error_message: error_message
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
        $("#main").addClass("splash-screen");

        var SplashScreenComponent = React.createFactory(SplashScreen);
        ReactDOM.render(SplashScreenComponent(), document.getElementById("application"));
    },
    render: function() {
        $("body").removeClass("splash-screen");

        let groupClasses = this.state.error_message != null ? "form-group has-error" : "form-group";
        let usernameClasses = groupClasses,
            passwordClasses = groupClasses,
            errorMessage = this.state.error_message != null ? "Login Failed: "+ this.state.error_message : null;

        //FIXME: Shamefully using modal- classnames outside of a modal
        return (
    <div>
        <LoginHeader />
        <div id="main" className="login-screen-master modal-body" style={{"marginTop": "24px"}}>
            <h2 className="t-headline">Login to Atmosphere:</h2>
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
                        onKeyPress={this.onEnterPressed}
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
                        onKeyPress={this.onEnterPressed}
                        />
                    <span className="help-block">{errorMessage}</span>
                </div>
                <div className="login-screen-footer modal-footer">
                    <button type="button"
                        className="btn btn-primary"
                        onClick={this.attemptLogin}
                        disabled={!this.isSubmittable()}>
                        Login to Atmosphere
                    </button>
                </div>
            </form>
        </div>
        <Footer text={globals.SITE_FOOTER}
                link={globals.SITE_FOOTER_LINK}
        />
    </div>
        );
    }

});
