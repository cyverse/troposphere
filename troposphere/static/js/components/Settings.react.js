/** @jsx React.DOM */

define(
  [
    'react',
    'components/PageHeader.react',
    'controllers/profile',
    './IconSelect.react'
  ],
  function (React, PageHeader, Profile, IconSelect) {

    return React.createClass({

      handleIconSelect: function (icon_type) {
        Profile.setIcons(this.props.profile, icon_type);
      },

      getSelectedIconSet: function () {
        var profile = this.props.profile;
        return profile ? profile.get('settings')['icon_set'] : null
      },

      render: function () {
        return (
          <div>
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
