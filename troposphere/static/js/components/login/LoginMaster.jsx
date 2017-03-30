import $ from "jquery";
import React from "react";
import globals from "globals";
import LoginScreen from "./LoginScreen";
import LoginHeader from "./LoginHeader";
import Footer from "../Footer";

export default React.createClass({
    displayName: "LoginMaster",

    render: function() {
        $("body").removeClass("splash-screen");

        return (
            <div>
                <LoginHeader />
                <LoginScreen />
                <Footer text={globals.SITE_FOOTER}
                        link={globals.SITE_FOOTER_LINK}
                />
            </div>
        );
    }

});

