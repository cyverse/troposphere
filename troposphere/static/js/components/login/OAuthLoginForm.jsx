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
              <div className="login-screen-footer modal-footer">
                  <button type="button"
                      className="btn btn-primary"
                      onClick={this.props.attemptLogin} >
                      {"Click to Login with " + this.props.provider}
                  </button>
              </div>
            </form>
        );
    }
});

