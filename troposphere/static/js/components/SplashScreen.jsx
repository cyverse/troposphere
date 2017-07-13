import $ from "jquery";
import React from "react";
import ReactDOM from "react-dom";

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import appTheme from 'theme/appTheme';

import { Router } from "react-router";

import context from "context";
import stores from "stores";

import Routes from "../AppRoutes";
import { appBrowserHistory } from "utilities/historyFunctions";

import featureFlags from "utilities/featureFlags";


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
            projects = stores.ProjectStore.getAll(),
            isEmulatedUser;

        if (profile && instances && volumes && projects) {

            // set user context
            context.profile = profile;
            //context.nullProject = nullProject;

            // if the emulator token exists, the user is being emulated by staff
            // in that case, this doesn't count as a real session, so don't report
            // it to Intercom.
            isEmulatedUser = !!window.emulator_token;

            if (!isEmulatedUser && featureFlags.hasIntercomActive()) {
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

            this.startApplication();
        }
    },

    componentDidMount: function() {
        stores.ProfileStore.addChangeListener(this.updateState);
        stores.InstanceStore.addChangeListener(this.updateState);
        stores.VolumeStore.addChangeListener(this.updateState);
        stores.ProjectStore.addChangeListener(this.updateState);
    },

    componentWillUnmount: function() {
        stores.ProfileStore.removeChangeListener(this.updateState);
        stores.InstanceStore.removeChangeListener(this.updateState);
        stores.VolumeStore.removeChangeListener(this.updateState);
        stores.ProjectStore.removeChangeListener(this.updateState);
    },

    startApplication: function() {
        const ProfileStore = stores.ProfileStore.get();

        $("body").removeClass("splash-screen");

        // Initialize Theme and start the application router
        //   - include the history (with an application basename)
        //   - on route change, update intercom so users get any
        //     messages sent to them
        const App = (
            <MuiThemeProvider muiTheme={getMuiTheme(appTheme)}>
                <Router
                    history={appBrowserHistory}
                    onChange={() => window.Intercom("update")}
                >
                    { Routes({ profile: ProfileStore }) }
                </Router>
            </MuiThemeProvider>
        );

        ReactDOM.render(
            App,
            document.getElementById("application")
        );
    },

    render: function() {
        return null;
    }

});
