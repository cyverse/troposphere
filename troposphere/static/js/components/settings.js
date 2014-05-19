/** @jsx React.DOM */

define(
  [
    'react',
    'components/PageHeader.react',
    'components/common/Gravatar.react',
    'controllers/profile',
    './IconOption.react',
    './IconSelect.react'
  ],
  function (React, PageHeader, Gravatar, Profile, IconOption, IconSelect) {

    return React.createClass({
      handleIconSelect: function (icon_type) {
        Profile.setIcons(this.props.profile, icon_type);
      },
      getSelectedIconSet: function () {
        var profile = this.props.profile;
        return profile ? profile.get('settings')['icon_set'] : null
      },
      render: function () {
        return React.DOM.div({},
          PageHeader({title: "Settings"}),
          React.DOM.h2({}, "Notifications"),
          React.DOM.h2({}, "Appearance"),
          React.DOM.p({}, "Image and instance icon set:"),
          IconSelect({
            selected: this.getSelectedIconSet(),
            onSelect: this.handleIconSelect}));
      }
    });

  });
