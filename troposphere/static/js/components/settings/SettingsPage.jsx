import { trackAction } from "../../utilities/userActivity";
import React from "react";
import AdvancedSettingsPage from "components/settings/AdvancedSettingsPage";
import IconSelect from "./IconSelect";
import GuacamoleSelect from "./GuacamoleSelect";
import VncResolutionSelect from "./VncResolutionSelect";
import SettingsHeader from "./SettingsHeader";
import actions from "actions";
import modals from "modals";
import stores from "stores";

function getState() {
    return {
        profile: stores.ProfileStore.get()
    };
}

export default React.createClass({
    displayName: "SettingsPage",

    getInitialState: function() {
        return getState();
    },

    updateState: function() {
        if (this.isMounted()) this.setState(getState());
    },

    componentDidMount: function() {
        stores.ProfileStore.addChangeListener(this.updateState);
    },

    componentWillUnmount: function() {
        stores.ProfileStore.removeChangeListener(this.updateState);
    },

    handleIconSelect: function(iconType) {
        actions.ProfileActions.updateProfileAttributes(this.state.profile, {
            icon_set: iconType
        });
    },

    handleColorSelect: function(colorType) {
        actions.ProfileActions.updateProfileAttributes(this.state.profile, {
            guacamole_color: colorType
        });
    },

    handleVncResolutionSelect: function(newRes) {
        actions.ProfileActions.updateProfileAttributes(this.state.profile, {
            vnc_resolution: newRes
        });
    },

    handleChangeEmailPreference: function(event) {
        var isChecked = event.target.checked;
        actions.ProfileActions.updateProfileAttributes(this.state.profile, {
            send_emails: isChecked
        });
    },

    handleRequestMoreResources: function(e) {
        trackAction("made-resource-request", {
            element: "from-settings"
        });
        e.preventDefault();
        modals.HelpModals.requestMoreResources();
    },

    render: function() {
        var profile = this.state.profile;
        var selectedIconSet = profile.get("settings")["icon_set"];
        var selectedGuacamoleColor = profile.get("settings")["guacamole_color"];
        var selectedVncResolution = profile.get("settings")["vnc_resolution"];
        var wantsEmails = profile.get("settings")["send_emails"];

        return (
        <div className="settings-view">
            <SettingsHeader/>
            <div className="container">
                <div className="notifications">
                    <h3 className="t-title">Notifications</h3>
                    <div>
                        <input type="checkbox" checked={wantsEmails} onChange={this.handleChangeEmailPreference} /> Receive an email notification when an instance finishes launching
                    </div>
                </div>
                <div>
                    <h3 className="t-title">Allocation</h3>
                    <div>
                        <p>
                            If you need a temporary or permanent boost in your allocation (more CPUs, etc.) you may <a href="#" onClick={this.handleRequestMoreResources}>request more resources.</a>
                        </p>
                    </div>
                </div>
                <div>
                    <h3 className="t-title">Appearance</h3>
                    <h4>Icon Color Select</h4>
                    <p>
                        Select the Image and Instance icon set you would like to use:
                    </p>
                    <IconSelect selected={selectedIconSet} onSelect={this.handleIconSelect} />

                    <h4>Web Shell Color Select</h4>
                    <p>
                        Use the form below to select color for SSH terminal in Web Shell.
                    </p>
                    <GuacamoleSelect selected={selectedGuacamoleColor} onSelect={this.handleColorSelect} />

                    <h4>VNC Resolution</h4>
                    <p>
                        Select the desired resolution of the Web Desktop.
                    </p>
                    <VncResolutionSelect selected={selectedVncResolution} onSelect={this.handleVncResolutionSelect} />
                </div>
                <AdvancedSettingsPage />
            </div>
        </div>
        );
    }
});
