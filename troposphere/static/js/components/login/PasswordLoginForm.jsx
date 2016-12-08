import React from "react";

export default React.createClass({
    displayName: "PasswordLoginForm",

    propTypes: {
        attemptLogin: React.PropTypes.func.isRequired,
    },

    //
    // Mounting & State
    // ----------------
    //

    getInitialState: function() {
        return {
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

    attemptLogin: function() {
        this.props.attemptLogin(
            this.state.username,
            this.state.password,
            this.onLoginError)
    },

    onLoginError: function(error_message) {
        this.setState({
            error_message: error_message
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

    render: function() {
        let groupClasses = this.state.error_message != null ? "form-group has-error" : "form-group";
        let usernameClasses = groupClasses,
            passwordClasses = groupClasses,
            errorMessage = this.state.error_message != null ? "Login Failed: "+ this.state.error_message : null;

        //FIXME: Shamefully using modal-footer : Get css-help later
        return (
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
        );
    }

});

