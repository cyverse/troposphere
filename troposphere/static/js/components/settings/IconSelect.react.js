
define(function (require) {
    var _ = require("underscore"),
        React = require("react"),
        IconOption = require("./IconOption.react");

    return React.createClass({
      displayName: "IconSelect",

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
      },

      render: function () {
        var icons = _.map(this.props.icons, function (text, type) {
          var isSelected = (type == this.props.selected);
          return (
            <IconOption key={text} type={type} text={text} selected={isSelected} onClick={this.handleClick}/>
          );
        }.bind(this));

        return (
          <ul id='icon-set-select'>{icons}</ul>
        );
      }

    });

  });
