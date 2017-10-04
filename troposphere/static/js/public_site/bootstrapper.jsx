import $ from "jquery";
import React from "react";
import ReactDOM from "react-dom";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import appTheme from 'theme/appTheme';

// Needed for MUI's onTouchTap
// http://stackoverflow.com/a/34015469/988941
import injectTapEvent from 'react-tap-event-plugin';
injectTapEvent();

import { Router } from "react-router";

import Profile from "models/Profile";

import routes from "./AppRoutes";
import { appBrowserHistory } from "utilities/historyFunctions";

import browserBondo from "utilities/browserBondo";
import modals from "modals";

modals.PublicModals = require("modals/PublicModals");

// Apply polyfills for older browser (intent: temporary use)
browserBondo.conditionalFill();

// Register which stores the application should use
import stores from "stores";

stores.ProviderStore = require("stores/ProviderStore");
stores.ImageStore = require("stores/ImageStore");
stores.ImageMetricsStore = require("stores/ImageMetricsStore");
stores.ImageBookmarkStore = require("stores/ImageBookmarkStore");
stores.ImageVersionStore = require("stores/ImageVersionStore");
stores.PatternMatchStore = require("stores/PatternMatchStore");
stores.TagStore = require("stores/TagStore");
stores.HelpLinkStore = require("stores/HelpLinkStore");

import actions from "actions";

actions.LoginActions = require("actions/LoginActions");

// Mock out the profile store with an empty profile
stores.ProfileStore = {
    get: function() {
        return new Profile({
            icon_set: "default"
        })
    },
    addChangeListener: function() {},
    removeChangeListener: function() {}
};

// Mock out the maintenance message store
stores.MaintenanceMessageStore = {
    getAll: function() {},
    addChangeListener: function() {},
    removeChangeListener: function() {}
};

function startApplication() {

    $(document).ready(function() {
        $("body").removeClass("splash-screen");

        const App = (
            <MuiThemeProvider muiTheme={getMuiTheme(appTheme)}>
                <Router history={appBrowserHistory}>
                    {routes}
                </Router>
            </MuiThemeProvider>
        );

        // Start the application router
        ReactDOM.render(
            App,
            document.getElementById("application"));
    });
}

export default {
    run: function() {
        startApplication();
    }
}
