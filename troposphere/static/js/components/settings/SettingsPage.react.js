/** @jsx React.DOM */

define(
  [
    'react',
    'components/common/PageHeader.react',
    './IconSelect.react',
    'context',
    './SettingsHeader.react',
    'actions/ProfileActions',
    'stores'
  ],
  function (React, PageHeader, IconSelect, context, SettingsHeader, ProfileActions, stores) {

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
        ProfileActions.updateProfileAttributes(context.profile, {icon_set: iconType});
      },

      getSelectedIconSet: function () {
        return context.profile.get('settings')['icon_set'];
      },

      render: function () {
        var selectedIconSet = this.getSelectedIconSet();

        return (
          <div className="settings-view">
            <SettingsHeader/>
            <div className="container">
              <div className="notifications">
                <h3>Notifications</h3>
                <div class="checkbox">
                  <input type="checkbox"/> Receive an email notification when an instance finishes launching
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
