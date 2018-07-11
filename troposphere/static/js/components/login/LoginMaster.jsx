import $ from "jquery";
import React from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import appTheme from "theme/appTheme";
import globals from "globals";
import LoginScreen from "./LoginScreen";
import LoginSplash from "./LoginSplash";
import LoginHeader from "./LoginHeader";
import Footer from "../Footer";

export default React.createClass({
    displayName: "LoginMaster",

    renderMain: function() {
        if (window.use_login_selection) {
            return <LoginScreen />;
        } else {
            return <LoginSplash />;
        }
    },
    render: function() {
        $("body").removeClass("splash-screen");

        return (
            <MuiThemeProvider muiTheme={getMuiTheme(appTheme)}>
                <div style={{paddingTop: "50px"}}>
                    <LoginHeader />
                    {this.renderMain()}
                    <Footer
                        text={globals.SITE_FOOTER}
                        link={globals.SITE_FOOTER_LINK}
                    />
                </div>
            </MuiThemeProvider>
        );
    }
});
