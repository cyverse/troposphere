import $ from "jquery";
import _ from "underscore";
import Backbone from "backbone";
import React from "react";
import ReactDOM from "react-dom";

// Needed for MUI's onTouchTap
// http://stackoverflow.com/a/34015469/988941
import injectTapEvent from 'react-tap-event-plugin';
injectTapEvent();

import SplashScreen from "components/SplashScreen";
import LoginMaster from "components/login/LoginMaster";
// Fixes aberrant lint violation found by TravisCI
//import MaintenanceScreen from "components/MaintenanceScreen";
import FunctionalCollection from "collections/FunctionalCollection";
import browserBondo from "utilities/browserBondo";

// Important:
//   Disconnect all Backbone Events from Models and Collections
Object.keys(Backbone.Events).forEach(function(functionName) {
    Backbone.Model.prototype[functionName] = function() {};
    Backbone.Collection.prototype[functionName] = function() {};
});


Backbone.Collection.prototype.get = function(obj) {
    if (obj == null) return void 0;
    return _.find(this.models, function(model) {
        return model.id == obj || model.id === obj.id || model.cid === obj.cid;
    });
};

// Extend the base collection to include useful functions
_.extend(Backbone.Collection.prototype, FunctionalCollection);

// Apply polyfills for older browser (intent: temporary use)
browserBondo.conditionalFill();

// Register which stores the image should use
import stores from "stores";

stores.AllocationStore = require("stores/AllocationStore");
stores.BadgeStore = require("stores/BadgeStore");
stores.ClientCredentialStore = require("stores/ClientCredentialStore");
stores.ExternalLinkStore = require("stores/ExternalLinkStore");
stores.HelpLinkStore = require("stores/HelpLinkStore");
stores.ImageStore = require("stores/ImageStore");
stores.ImageMetricsStore = require("stores/ImageMetricsStore");
stores.ImageVersionStore = require("stores/ImageVersionStore");
stores.ImageVersionMembershipStore = require("stores/ImageVersionMembershipStore");
stores.ImageVersionLicenseStore = require("stores/ImageVersionLicenseStore");
stores.ImageVersionScriptStore = require("stores/ImageVersionScriptStore");
stores.IdentityStore = require("stores/IdentityStore");
stores.ImageBookmarkStore = require("stores/ImageBookmarkStore");
stores.InstanceHistoryStore = require("stores/InstanceHistoryStore");
stores.InstanceActionStore = require("stores/InstanceActionStore");
stores.ImageRequestStore = require("stores/ImageRequestStore");
stores.InstanceStore = require("stores/InstanceStore");
stores.InstanceTagStore = require("stores/InstanceTagStore");
stores.LicenseStore = require("stores/LicenseStore");
stores.ScriptStore = require("stores/ScriptStore");
stores.MaintenanceMessageStore = require("stores/MaintenanceMessageStore");
stores.MyBadgeStore = require("stores/MyBadgeStore");
stores.MembershipStore = require("stores/MembershipStore");
stores.ProfileStore = require("stores/ProfileStore");
stores.ProjectStore = require("stores/ProjectStore");
stores.ProjectExternalLinkStore = require("stores/ProjectExternalLinkStore");
stores.ProjectImageStore = require("stores/ProjectImageStore");
stores.ProjectInstanceStore = require("stores/ProjectInstanceStore");
stores.ProjectVolumeStore = require("stores/ProjectVolumeStore");
stores.ProviderMachineStore = require("stores/ProviderMachineStore");
stores.ProviderStore = require("stores/ProviderStore");
stores.ResourceRequestStore = require("stores/ResourceRequestStore");
stores.IdentityMembershipStore = require("stores/IdentityMembershipStore");
stores.StatusStore = require("stores/StatusStore");
stores.SSHKeyStore = require("stores/SSHKeyStore");
stores.QuotaStore = require("stores/QuotaStore");
stores.SizeStore = require("stores/SizeStore");
stores.TagStore = require("stores/TagStore");
stores.UserStore = require("stores/UserStore");
stores.VersionStore = require("stores/VersionStore");
stores.VolumeStore = require("stores/VolumeStore");
stores.AllocationSourceStore = require("stores/AllocationSourceStore");

import actions from "actions";

actions.AccountActions = require("actions/AccountActions");
actions.BadgeActions = require("actions/BadgeActions");
actions.ExternalLinkActions = require("actions/ExternalLinkActions");
actions.HelpActions = require("actions/HelpActions");
actions.IdentityMembershipActions = require("actions/IdentityMembershipActions");
actions.ImageActions = require("actions/ImageActions");
actions.ImageVersionActions = require("actions/ImageVersionActions");
actions.ImageVersionMembershipActions = require("actions/ImageVersionMembershipActions");
actions.ImageVersionLicenseActions = require("actions/ImageVersionLicenseActions");
actions.ImageVersionScriptActions = require("actions/ImageVersionScriptActions");
actions.ImageBookmarkActions = require("actions/ImageBookmarkActions");
actions.InstanceActions = require("actions/InstanceActions");
actions.InstanceTagActions = require("actions/InstanceTagActions");
actions.InstanceVolumeActions = require("actions/InstanceVolumeActions");
actions.LicenseActions = require("actions/LicenseActions");
actions.LoginActions = require("actions/LoginActions");
actions.ScriptActions = require("actions/ScriptActions");
actions.NullProjectActions = require("actions/NullProjectActions");
actions.ProfileActions = require("actions/ProfileActions");
actions.ProjectActions = require("actions/ProjectActions");
actions.ProviderActions = require("actions/ProviderActions");
actions.ProviderMachineActions = require("actions/ProviderMachineActions");
actions.ProjectExternalLinkActions = require("actions/ProjectExternalLinkActions");
actions.ProjectImageActions = require("actions/ProjectImageActions");
actions.ProjectInstanceActions = require("actions/ProjectInstanceActions");
actions.ProjectVolumeActions = require("actions/ProjectVolumeActions");
actions.ResourceActions = require("actions/ResourceActions");
actions.TagActions = require("actions/TagActions");
actions.UserActions = require("actions/UserActions");
actions.VolumeActions = require("actions/VolumeActions");

import modals from "modals";

modals.AccountModals = require("modals/AccountModals");
modals.BadgeModals = require("modals/BadgeModals");
modals.ExpiredPasswordModals = require("modals/ExpiredPasswordModals");
modals.ExternalLinkModals = require("modals/ExternalLinkModals");
modals.HelpModals = require("modals/HelpModals");
modals.InstanceModals = require("modals/InstanceModals");
modals.InstanceVolumeModals = require("modals/InstanceVolumeModals");
modals.PublicModals = require("modals/PublicModals");
modals.ProjectModals = require("modals/ProjectModals");
modals.ProviderModals = require("modals/ProviderModals");
modals.TagModals = require("modals/TagModals");
modals.VersionModals = require("modals/VersionModals");
modals.VolumeModals = require("modals/VolumeModals");
modals.UnsupportedModal = require("modals/UnsupportedModal");

export default {
    run: function() {
        let authHeaders = {
            "Content-Type": "application/json"
        }

        // Assure that an auth header is only included when we have
        // an actually `access_token` to provide.
        if (window.access_token) {
            authHeaders["Authorization"] = "Token " + window.access_token;
        }


        // Make sure the Authorization header is added to every AJAX request
        $.ajaxSetup({
            headers: authHeaders
        });

        // We're wrapping Backbone.sync so that we can observe every AJAX request.
        // If any request returns a 503 (service unavailable) then we're going to
        // throw up the maintenance splash page. Otherwise, just pass the response
        // up to chain.
        var originalSync = Backbone.sync;
        Backbone.sync = function(attrs, textStatus, xhr) {
            var dfd = $.Deferred();

            originalSync.apply(this, arguments).then(function() {
                dfd.resolve.apply(this, arguments);
            }).fail(function(response) {
                if (response.status === 503) {
                    window.location = '/maintenance'
                } else {
                    dfd.reject.apply(this, arguments);
                }
            });

            return dfd.promise();
        };

        // render the splash page which will load the rest of the application
        $(document).ready(function() {
            var SplashScreenComponent = React.createFactory(SplashScreen);
            var LoginMasterComponent = React.createFactory(LoginMaster);

            //Show login component when user is not already-logged in.
            const Render = window.access_token ? 
                SplashScreenComponent() : LoginMasterComponent();

            ReactDOM.render(Render, document.getElementById("application"));
        });
    }
}
