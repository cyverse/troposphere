import $ from "jquery";
import React from "react";
import ReactDOM from "react-dom";
import { Router,
         browserHistory } from "react-router";

import context from "context";
import stores from "stores";

import routes from "../AppRoutes";
import { withAppBasename } from "utilities/historyFunctions";

import Raven from "raven-js";

export default React.createClass({
    displayName: "SplashScreen",

    //
    // Mounting & State
    // ----------------
    //

    getInitialState: function() {
        return {
            profile: stores.ProfileStore.get(),
            instances: stores.InstanceStore.getAll(),
            volumes: stores.VolumeStore.getAll()
        };
    },

    updateState: function() {
        var profile = stores.ProfileStore.get(),
            instances = stores.InstanceStore.getAll(),
            volumes = stores.VolumeStore.getAll(),
            isEmulatedUser;

        if (profile && instances && volumes) {

            // set user context
            context.profile = profile;
            //context.nullProject = nullProject;

            // if the emulator token exists, the user is being emulated by staff
            // in that case, this doesn't count as a real session, so don't report
            // it to Intercom.
            isEmulatedUser = !!window.emulator_token;

            if (!isEmulatedUser) {
                window.Intercom("boot", {
                    app_id: window.intercom_app_id,
                    name: profile.get("username"),
                    username: profile.get("username"),
                    email: profile.get("email"),
                    company: {
                        id: window.intercom_company_id,
                        name: window.intercom_company_name
                    }
                // TODO: The current logged in user's sign-up date as a Unix timestamp.
                //created_at: 1234567890
                });
            }

            if (Raven && Raven.isSetup()){
                Raven.setUserContext({
                    id: profile.get("user"),
                    name: profile.get("username"),
                    email: profile.get("email"),
                    username: profile.get("username")
                });
            }

            this.startApplication();
        }
    },

    componentDidMount: function() {
        stores.ProfileStore.addChangeListener(this.updateState);
        stores.InstanceStore.addChangeListener(this.updateState);
        stores.VolumeStore.addChangeListener(this.updateState);
    },

    componentWillUnmount: function() {
        stores.ProfileStore.removeChangeListener(this.updateState);
        stores.InstanceStore.removeChangeListener(this.updateState);
        stores.VolumeStore.removeChangeListener(this.updateState);
    },

    startApplication: function() {

        $("body").removeClass("splash-screen");

        // Start the application router
        //   - include the history (with an application basename)
        //   - on route change, update intercom so users get any
        //     messages sent to them
        ReactDOM.render(
            <Router history={withAppBasename(browserHistory)}
                    onChange={() => window.Intercom("update")}>
                {routes}
            </Router>,
            document.getElementById("application"));
    },

    render: function() {
        return null;
    }

});
