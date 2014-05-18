define(
  [
    'react',
    'components/PageHeader.react',
    'components/common/Gravatar.react',
    'controllers/profile'
  ],
  function (React, PageHeader, Gravatar, Profile) {

    var IconOption = React.createClass({
      render: function () {
        return React.DOM.li({className: this.props.selected ? 'selected' : ''},
          React.DOM.a({
              href: "#",
              onClick: _.partial(this.props.onClick, this.props.type),
            },
            Gravatar({hash: '4dada4e6ac8298336c7063ae603ea86d', type: this.props.type}),
            React.DOM.br(),
            this.props.text));
      }
    });

    var IconSelect = React.createClass({
      getDefaultProps: function () {
        return {
          icons: {
            'default': 'Identicons',
            retro: 'Retro',
            robot: 'Robots',
            unicorn: 'Unicorns',
            monster: 'Monsters',
            wavatar: 'Wavatars'
          }
        };
      },
      handleClick: function (icon_type, e) {
        e.preventDefault();
        this.props.onSelect(icon_type);
        console.log(this);
      },
      render: function () {
        console.log(this.props);
        return React.DOM.ul({id: 'icon-set-select'}, _.map(this.props.icons, function (text, type) {
          return IconOption({
            type: type,
            text: text,
            selected: type == this.props.selected,
            onClick: this.handleClick});
        }.bind(this)));
      }
    });

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
