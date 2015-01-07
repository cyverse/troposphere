/** @jsx React.DOM */

define(
  [
    'react',
    'components/common/PageHeader.react',
    './IconSelect.react',
    './SettingsHeader.react',
    'actions',
    'stores'
  ],
  function (React, PageHeader, IconSelect, SettingsHeader, actions, stores) {

    function getState() {
      return {
        profile: stores.ProfileStore.get()
      };
    }

    return React.createClass({

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

      handleChangeEmailPreference: function(event){
        var isChecked = event.target.checked;
        actions.ProfileActions.updateProfileAttributes(this.state.profile, {send_emails: isChecked});
      },

      handleRequestMoreResources: function(e){
        e.preventDefault();
        actions.HelpActions.requestMoreResources();
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
                  <input type="checkbox" checked={wantsEmails} onChange={this.handleChangeEmailPreference}/> Receive an email notification when an instance finishes launching
                </div>
              </div>
              <div>
                <h3>Allocation</h3>
                <div>
                  <p>If you need a temporary or permanent boost in your allocation (more CPUs, etc.) you may <a href="#" onClick={this.handleRequestMoreResources}>request more resources.</a></p>
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

  });
