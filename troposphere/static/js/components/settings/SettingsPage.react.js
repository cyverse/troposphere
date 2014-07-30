/** @jsx React.DOM */

define(
  [
    'react',
    'components/common/PageHeader.react',
    './IconSelect.react',
    'context'
  ],
  function (React, PageHeader, IconSelect, context) {

    return React.createClass({

      handleIconSelect: function (icon_type) {
        alert.show("handleIconSelect not implemented");
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
        return (
          <div className="container">
            <PageHeader title="Settings"/>
            <h2>Notifications</h2>
            <h2>Appearance</h2>
            <p>Image and instance icon set:</p>
            <IconSelect selected={this.getSelectedIconSet()} onSelect={this.handleIconSelect}/>
          </div>
        );
      }

    });

  });
