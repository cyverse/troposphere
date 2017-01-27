import $ from "jquery";
import actions from "actions";
import globals from "globals";
import React from "react";
import Backbone from "backbone";
import ReactDOM from "react-dom";
import NotificationController from "controllers/NotificationController";

export default React.createClass({
    displayName: "LoginSplash",

    //
    // Mounting & State
    // ----------------
    //

    render: function() {
        return (
          <div id="dashboard-view">
           <div className="login-screen-master container" style={{"paddingTop": "30px"}}>
                <h2 className="t-headline">{"Login to " + window.SITE_TITLE} </h2>
                <div className="row calls-to-action">
                  <div>
                    <a className="option" href="/login">
                        <img src="/assets/theme/images/icon_launchnewinstance.png"/><br/>
                        <h2 className="t-title option__title">
                          {"Log in with your " + window.ORG_NAME + " Account"}
                        </h2><hr/>
                        <p className="option__description">{"Login to browse Atmosphere's list of available images and select one to launch a new instance."}</p>
                    </a>
                  </div>
                </div>
              </div>
           </div>
        );
    }
});
