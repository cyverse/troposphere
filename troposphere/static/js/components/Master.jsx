import React from "react";
import stores from "stores";
import Backbone from "backbone";
import context from "context";
import globals from "globals";
import Header from "./Header";
import Footer from "./Footer";
import actions from "actions";
import modals from "modals";
import modernizrTest from "components/modals/unsupported/modernizrTest";
import NullProject from "models/NullProject";
import noAllocationSource from "modals/allocationSource/noAllocationSource";

import Router from "react-router";
import { RouteHandler } from "react-router";

export default React.createClass({
    displayName: "Master",

    mixins: [Router.State],

    getState: function() {
        return {};
    },

    getInitialState: function() {
        var profile = stores.ProfileStore.get();
        if (!context.profile && profile) {
            context.profile = profile;
        }
        return this.getState();
    },

    updateState: function() {
        if (this.isMounted()) this.setState(this.getState())
    },

    loadBadgeData: function() {
        stores.BadgeStore.getAll(),
        stores.MyBadgeStore.getAll(),
        stores.InstanceHistoryStore.getAllAndCheckBadges();
        stores.ImageBookmarkStore.getAllAndCheckBadges();
    },

    componentDidMount: function() {
        // subscribe to all Stores
        Object.keys(stores).forEach(function(storeName) {
            stores[storeName].addChangeListener(this.updateState);
        }.bind(this));

        if (globals.BADGES_ENABLED) {
            this.loadBadgeData();
        }

        // The code below is only relevant to logged in users
        if (!context.hasLoggedInUser()) return;

        // IMPORTANT! We get one shot at this. If the instances and volumes aren't
        // fetched before this component is mounted we miss our opportunity to migrate
        // the users resources (so make sure they're fetched in the Splash Screen)
        var orphans = stores.InstanceStore.getInstancesNotInAProject(),
            volumes = stores.VolumeStore.getVolumesNotInAProject(),
            nullProject = new NullProject({
                instances: orphans,
                volumes: volumes
            });

        let instances = stores.InstanceStore.getAll();

        new Promise((resolve, reject) => {
            if (globals.USE_ALLOCATION_SOURCES) {
                // Filter instances without AS
                let missing = instances.cfilter(i => !i.get("allocation_source"));

                if (missing.length > 0) {
                    noAllocationSource.showModal(missing, resolve);
                } else {
                    // give the other promises a shot at handling things
                    resolve();
                }
            } else {
                // Continue on to the next promise
                resolve();
            }
        }).then(

            // After the previous promise was resolved, we create this promise
            // to launch the next modal if we need to
            () => new Promise((resolve, reject) => {
                modernizrTest.unsupported()
                    ? modals.UnsupportedModal.showModal(resolve)
                    : resolve();
            })

        ).then(() => {
            !nullProject.isEmpty()
                ? actions.NullProjectActions.migrateResourcesIntoProject(nullProject)
                : actions.NullProjectActions.moveAttachedVolumesIntoCorrectProject();
        })
    },

    componentWillUnmount: function() {
        // un-subscribe from all Stores
        Object.keys(stores).forEach(function(storeName) {
            stores[storeName].removeChangeListener(this.updateState);
        }.bind(this));
    },

    // --------------
    // Render Helpers
    // --------------

    render: function() {

        if (!window.show_public_site && !context.hasLoggedInUser()) {
            //Users who ARE logged in, but without an identity
            //cannot be handled in the application, currently.
            //These users are punted now.
            var username = context.profile.get("username"),
                errorText = "User <" + username + "> was authenticated, but has no available, active identities. Contact your Cloud Administrator.",
                error_status = encodeURIComponent(errorText);
            window.location = "/forbidden?banner=" + error_status;
        }

        var maintenanceMessages = stores.MaintenanceMessageStore.getAll() || new Backbone.Collection(),
            marginTop = maintenanceMessages.length * 24 + "px";

        return (
        <div>
            <Header profile={ context.profile }
                    currentRoute={ ['projects'] }
                    maintenanceMessages={ maintenanceMessages } />
            <div id="main" style={ { 'marginTop': marginTop } }>
                <RouteHandler/>
            </div>
            <Footer text={globals.SITE_FOOTER}
                    link={globals.SITE_FOOTER_LINK}
                    profile={context.profile} />
        </div>
        );
    }

});
