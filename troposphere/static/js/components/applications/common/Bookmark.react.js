/** @jsx React.DOM */

define(
  [
    'react'
  ],
  function (React) {

    return React.createClass({

      toggleFavorite: function (e) {
        e.preventDefault();
        this.props.application.set('favorite', !this.props.application.get('favorite'));
      },

      render: function () {
        var isFavorite = this.props.application.get('favorite');
        var className = 'bookmark ' + (isFavorite ? 'on' : 'off');

        return (
          <a className={className} href="#" onClick={this.toggleFavorite}></a>
        );
      }

    });

  });
