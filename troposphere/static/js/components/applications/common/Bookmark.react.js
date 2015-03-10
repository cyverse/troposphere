define(function (require) {

  var React = require('react'),
      actions = require('actions');

  return React.createClass({

    toggleFavorite: function (e) {
      e.preventDefault();
      actions.ApplicationActions.toggleFavorited(this.props.application);
    },

    render: function () {
      var isFavorite = this.props.application.get('isFavorited'),
          img;

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
