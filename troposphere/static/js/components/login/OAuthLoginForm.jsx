import React from "react";
import RaisedButton from "material-ui/RaisedButton";

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
        const { provider } = this.props;
        return (
            <form>
              <div className="login-screen-footer modal-footer">
                  <RaisedButton
                      primary
                      onTouchTap={this.props.attemptLogin}
                      label={ `Click to Login with ${provider}` }
                  />
              </div>
            </form>
        );
    }
});

