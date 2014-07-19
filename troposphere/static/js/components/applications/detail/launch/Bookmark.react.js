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

        var img;
        if(isFavorite){
          img = (
            <img src="/assets/images/filled-star-icon.png"/>
          );
        }else {
          img = (
            <img src="/assets/images/empty-star-icon.png"/>
          );
        }

        return (
          <a className="bookmark" href="#" onClick={this.toggleFavorite}>
            {img}
          </a>
        );
      }

    });

  });
