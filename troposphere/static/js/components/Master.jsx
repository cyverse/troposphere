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

import Raven from "raven-js";


export default React.createClass({
    displayName: "Master",

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

        if (Raven && window.SENTRY_DSN){
            if (! Raven.isSetup()) {
                Raven.config(
                    window.SENTRY_DSN
                ).install();
            }
            this.loadRavenData();
        }

        // IMPORTANT! We get one shot at this. If the instances and volumes aren't
        // fetched before this component is mounted we miss our opportunity to migrate
        // the users resources (so make sure they're fetched in the Splash Screen)
        var instances = stores.InstanceStore.getInstancesNotInAProject(),
            volumes = stores.VolumeStore.getVolumesNotInAProject(),
            nullProject = new NullProject({
                instances: instances,
                volumes: volumes
            });
        let all_instances = stores.InstanceStore.getAll();

        Promise.resolve()
            .then(
                () => {
                    if (globals.USE_ALLOCATION_SOURCES) {
                        let profile = context.profile,
                            username =  profile.get('username'),
                            missing = all_instances.cfilter(
                                i => !i.get("allocation_source") && i.get('user').username == username
                            );

                        if (missing.length > 0) {
                            return modals.NoAllocationSourceModal.showModal(missing);
                        }
                    }
                }
            )
           .then(
               () => {
                   if (modernizrTest.unsupported()) {
                       return modals.UnsupportedModal.showModal();
                   }
               }
            ).then(
                () =>
                    nullProject.isEmpty()
                    ? actions.NullProjectActions.moveAttachedVolumesIntoCorrectProject()
                    : actions.NullProjectActions.migrateResourcesIntoProject(nullProject)
            )
    },

    loadRavenData: function() {
        let profile = context.profile;
        let userContext = {
            id: profile.get('user'),
            email: profile.get('email'),
            username: profile.get('username'),
        }

        if (context.hasEmulatedSession()) {
            userContext.emulated = true;
            userContext.emulator = context.getEmulator();
        }

        Raven.setUserContext(userContext);
        Raven.setTagsContext(window.SENTRY_TAGS);
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
                {this.props.children}
            </div>
            <Footer text={globals.SITE_FOOTER}
                    link={globals.SITE_FOOTER_LINK}
                    profile={context.profile} />
        </div>
        );
    }

});
