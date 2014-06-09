/** @jsx React.DOM */

define(
  [
    'react',
    'actions/ApplicationActions'
  ],
  function (React, ApplicationActions) {

    return React.createClass({

      toggleFavorite: function (e) {
        e.preventDefault();
        ApplicationActions.toggleFavorited(this.props.application);
      },

      render: function () {
        var isFavorite = this.props.application.get('isFavorited');
        var className = 'bookmark ' + (isFavorite ? 'on' : 'off');

        return (
          <a className={className} href="#" onClick={this.toggleFavorite}></a>
        );
      }

    });

  });
