import React from "react";

export default React.createClass({
    displayName: "OAuthLoginForm",

    //
    // Mounting & State
    // ----------------
    //

    getInitialState: function() {
        return {};
    },
    render: function() {
        return (
            <form>
                <div >
                    <button type="button"
                        className="btn btn-primary"
                        onClick={this.props.attemptLogin} >
                        {"Click to Login with " + window.login_auth_provider}
                    </button>
                </div>
            </form>
        );
    }
});

