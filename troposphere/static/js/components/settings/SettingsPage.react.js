/** @jsx React.DOM */

define(
  [
    'react',
    'components/common/PageHeader.react',
    './IconSelect.react',
    'context',
    './SettingsHeader.react'
  ],
  function (React, PageHeader, IconSelect, context, SettingsHeader) {

    return React.createClass({

      handleIconSelect: function (icon_type) {
        alert("handleIconSelect not implemented");
        // todo: move into ProfileStore and ProfileActions
        // setIcons: function (profile, icon_type) {
        //   profile.save({icon_set: icon_type}, {
        //     patch: true,
        //     success: function () {
        //       NotificationController.success("Updated", "Your icon preference was changed successfully.");
        //     }.bind(this),
        //     error: function () {
        //       NotificationController.error("Error", "Your icon preference was not changed successfully.");
        //     }
        //   });
        // }
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
