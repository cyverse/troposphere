import React from 'react/addons';
import Profile from 'models/Profile';
import $ from 'jquery';
import Router from '../Router';
import routes from './AppRoutes.react';


import modals from 'modals';

modals.PublicModals = require('modals/PublicModals');

// Register which stores the application should use
import stores from 'stores';

stores.ImageStore = require('stores/ImageStore');
stores.ImageBookmarkStore = require('stores/ImageBookmarkStore');
stores.ImageVersionStore = require('stores/ImageVersionStore');
stores.TagStore = require('stores/TagStore');
stores.HelpLinkStore    = require('stores/HelpLinkStore');

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
        $('body').removeClass('splash-screen');

        // Start the application router
        Router.getInstance(routes).run(function(Handler, state) {
            // you might want to push the state of the router to a store for whatever reason
            // RouterActions.routeChange({routerState: state});

            // whenever the url changes, this callback is called again
            React.render(<Handler /> , document.getElementById("application"));
        });
    });
}

export default {
    run: function() {
        startApplication();
    }
}
