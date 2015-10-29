import React from 'react';
import PageHeader from 'components/common/PageHeader.react';
import IconSelect from './IconSelect.react';
import SettingsHeader from './SettingsHeader.react';
import actions from 'actions';
import modals from 'modals';
import stores from 'stores';

function getState() {
    return {
        profile: stores.ProfileStore.get()
    };
}

export default React.createClass({
    displayName: "SettingsPage",

    getInitialState: function () {
        return getState();
    },

    updateState: function () {
        if (this.isMounted()) this.setState(getState());
    },

    componentDidMount: function () {
        stores.ProfileStore.addChangeListener(this.updateState);
    },

    componentWillUnmount: function () {
        stores.ProfileStore.removeChangeListener(this.updateState);
    },

    handleIconSelect: function (iconType) {
        actions.ProfileActions.updateProfileAttributes(this.state.profile, {icon_set: iconType});
    },

    handleChangeEmailPreference: function (event) {
        var isChecked = event.target.checked;
        actions.ProfileActions.updateProfileAttributes(this.state.profile, {send_emails: isChecked});
    },

    handleRequestMoreResources: function (e) {
        e.preventDefault();
        modals.HelpModals.requestMoreResources();
    },

    render: function () {
        var profile = this.state.profile;
        var selectedIconSet = profile.get('settings')['icon_set'];
        var wantsEmails = profile.get('settings')['send_emails'];

        return (
          <div className="settings-view">
            <SettingsHeader/>

            <div className="container">
              <div className="notifications">
                <h3>Notifications</h3>

                <div>
                  <input type="checkbox" checked={wantsEmails} onChange={this.handleChangeEmailPreference}/> Receive an
                  email notification when an instance finishes launching
                </div>
              </div>
              <div>
                <h3>Allocation</h3>

                <div>
                  <p>If you need a temporary or permanent boost in your allocation (more CPUs, etc.) you may <a href="#"
                                                                                                                onClick={this.handleRequestMoreResources}>request
                    more resources.</a></p>
                </div>
              </div>
              <div>
                <h3>Appearance</h3>

                <p>Select the Image and Instance icon set you would like to use:</p>
                <IconSelect selected={selectedIconSet} onSelect={this.handleIconSelect}/>
              </div>
            </div>
          </div>
        );
    }
});

