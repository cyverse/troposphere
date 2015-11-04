define(function (require) {

  var React = require('react/addons'),
    actions = require('actions'),
    stores = require('stores'),
    filled_star = require("images/filled-star-icon.png"),
    empty_star = require("images/empty-star-icon.png");

  return React.createClass({
    displayName: "Bookmark",

    toggleFavorite: function (e) {
      e.preventDefault();
      var image = this.props.image,
        imageBookmark = stores.ImageBookmarkStore.findOne({
          'image.id': image.id
        });

      if (imageBookmark) {
        actions.ImageBookmarkActions.removeBookmark({image: image});
      } else {
        actions.ImageBookmarkActions.addBookmark({image: image});
      }
    },

    render: function () {
      var image = this.props.image,
        isFavorited = stores.ImageBookmarkStore.findOne({
          'image.id': image.id
        }),
        img;

      if (isFavorited) {
        img = (
          <img src={filled_star}/>
        );
      } else {
        img = (
          <img src={empty_star}/>
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
