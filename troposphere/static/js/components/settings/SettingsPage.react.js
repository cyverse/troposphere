/** @jsx React.DOM */

define(
  [
    'react',
    'components/common/PageHeader.react',
    'controllers/ProfileController',
    './IconSelect.react',
    'context'
  ],
  function (React, PageHeader, ProfileController, IconSelect, context) {

    return React.createClass({

      handleIconSelect: function (icon_type) {
        ProfileController.setIcons(context.profile, icon_type);
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
