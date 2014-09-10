/** @jsx React.DOM */

define(
  [
    'react',
    'stores'
  ],
  function (React, stores) {

    return React.createClass({

      propTypes: {
        type: React.PropTypes.string
      },

      getDefaultProps: function () {
        return {
          //type: profile ? profile.get('settings')['icon_set'] : 'default',
          type: 'default',
          size: 50
        };
      },

      propTypes: {
        hash: React.PropTypes.string,
        type: React.PropTypes.string,
        size: React.PropTypes.number
      },

      getSrc: function (hash, icon_set, size) {
        switch (icon_set) {
          case 'unicorn':
            return "//unicornify.appspot.com/avatar/" + hash + "?s=" + size;
          case 'wavatar':
            return "//www.gravatar.com/avatar/" + hash + "?d=wavatar&s=" + size;
          case 'monster':
            return "//www.gravatar.com/avatar/" + hash + "?d=monsterid&s=" + size;
          case 'retro':
            return "//www.gravatar.com/avatar/" + hash + "?d=retro&s=" + size;
          case 'robot':
            return "//robohash.org/" + hash + "?size=" + size + "x" + size;
          default:
            return "//www.gravatar.com/avatar/" + hash + "?d=identicon&s=" + size;
        }
      },

      render: function () {
        /* If a type is specified in props, use it. Otherwise, use the
         * profile setting
         */

        var imgSrc = this.getSrc(this.props.hash, this.props.type, this.props.size);
        return (
          <img src={imgSrc} width={this.props.size} height={this.props.size}/>
        );
      }

    });

  });
