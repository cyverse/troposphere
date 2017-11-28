import React from "react";

import AllocationStore from "stores/AllocationStore";
import BadgeStore from "stores/BadgeStore";
import ClientCredentialStore from "stores/ClientCredentialStore";
import GroupStore from "stores/GroupStore";
import ExternalLinkStore from "stores/ExternalLinkStore";
import HelpLinkStore from "stores/HelpLinkStore";
import ImageStore from "stores/ImageStore";
import ImagePatternMatchStore from "stores/ImagePatternMatchStore";
import ImageMetricsStore from "stores/ImageMetricsStore";
import ImageVersionStore from "stores/ImageVersionStore";
import ImageVersionMembershipStore from "stores/ImageVersionMembershipStore";
import ImageVersionLicenseStore from "stores/ImageVersionLicenseStore";
import ImageVersionScriptStore from "stores/ImageVersionScriptStore";
import IdentityStore from "stores/IdentityStore";
import ImageBookmarkStore from "stores/ImageBookmarkStore";
import InstanceHistoryStore from "stores/InstanceHistoryStore";
import ImageRequestStore from "stores/ImageRequestStore";
import InstanceStore from "stores/InstanceStore";
import InstanceTagStore from "stores/InstanceTagStore";
import LicenseStore from "stores/LicenseStore";
import ScriptStore from "stores/ScriptStore";
import MaintenanceMessageStore from "stores/MaintenanceMessageStore";
import MyBadgeStore from "stores/MyBadgeStore";
import MembershipStore from "stores/MembershipStore";
import PatternMatchStore from "stores/PatternMatchStore";
import ProfileStore from "stores/ProfileStore";
import ProjectStore from "stores/ProjectStore";
import ProjectExternalLinkStore from "stores/ProjectExternalLinkStore";
import ProjectImageStore from "stores/ProjectImageStore";
import ProjectInstanceStore from "stores/ProjectInstanceStore";
import ProjectVolumeStore from "stores/ProjectVolumeStore";
import ProviderMachineStore from "stores/ProviderMachineStore";
import ProviderStore from "stores/ProviderStore";
import ResourceRequestStore from "stores/ResourceRequestStore";
import AdminResourceRequestStore from "stores/AdminResourceRequestStore";
import IdentityMembershipStore from "stores/IdentityMembershipStore";
import StatusStore from "stores/StatusStore";
import SSHKeyStore from "stores/SSHKeyStore";
import QuotaStore from "stores/QuotaStore";
import SizeStore from "stores/SizeStore";
import TagStore from "stores/TagStore";
import UserStore from "stores/UserStore";
import VersionStore from "stores/VersionStore";
import VolumeStore from "stores/VolumeStore";
import AllocationSourceStore from "stores/AllocationSourceStore";

// Create a dictionary of all stores
//
// We cannot rely on `import stores from 'stores'`, since it is populated too
// late. This wrapper component wraps the module when it is defined and
// stores.<STORE_NAME> isn't available then.
let stores = {
    AllocationStore, BadgeStore, ClientCredentialStore, GroupStore, ExternalLinkStore, HelpLinkStore, ImageStore, ImagePatternMatchStore, ImageMetricsStore, ImageVersionStore, ImageVersionMembershipStore, ImageVersionLicenseStore, ImageVersionScriptStore, IdentityStore, ImageBookmarkStore, InstanceHistoryStore, ImageRequestStore, InstanceStore, InstanceTagStore, LicenseStore, ScriptStore, MaintenanceMessageStore, MyBadgeStore, MembershipStore, PatternMatchStore, ProfileStore, ProjectStore, ProjectExternalLinkStore, ProjectImageStore, ProjectInstanceStore, ProjectVolumeStore, ProviderMachineStore, ProviderStore, ResourceRequestStore, AdminResourceRequestStore, IdentityMembershipStore, StatusStore, SSHKeyStore, QuotaStore, SizeStore, TagStore, UserStore, VersionStore, VolumeStore, AllocationSourceStore
}

// Add change listeners to the component for the following stores. The stores
// will be added to the props of the instance via a prop called subscriptions.
// Inside the wrapped component:
//
//     let { ProfileStore } = this.props.subscriptions;
//
// Only stores included in storeNames will be visible to the component
export default function(component, storeNames) {
    let subscriptions = {};
    storeNames.forEach(name => {
        if (stores[name]) {
            subscriptions[name] = stores[name];
        } else {
            // If this is thrown either:
            //    The store needs to be added to the above stores object /OR/
            //    The store name was a typo and needs to be fixed in the component
            throw new Error(`The store: ${name} does not exist. It cannot be subscribed to.`);
        }
    });

    return React.createClass({
        componentDidMount: function() {
            Object.values(subscriptions)
                  .forEach(store => {
                      store.addChangeListener(this.updateState)
                  });
        },

        componentWillUnmount: function() {
            Object.values(subscriptions)
                  .forEach(store => {
                      store.removeChangeListener(this.updateState)
                  });
        },

        updateState: function() {
            this.forceUpdate();
            this.callSubscribeListeners();
        },
        getInitialState: function() {
            return {
                subscribeListeners: []
            }
        },
        callSubscribeListeners: function() {
            this.state.subscribeListeners.forEach(
                cb => cb()
            );

        },
        addSubscriber: function(callback) {
            this.state.subscribeListeners.push(
                    callback)
        },

        render: function() {
            // Define the props so that we extend props, with a new prop:
            // 'subscriptions'
            let newProps = Object.assign(
                    {},
                    this.props,
                    { subscriptions, addSubscriber:this.addSubscriber});
            return React.createElement(component, newProps);
        }
    });
}
