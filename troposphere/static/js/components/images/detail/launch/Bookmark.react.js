import React from 'react/addons';
import actions from 'actions';
import stores from 'stores';
import filled_star from "images/filled-star-icon.png";
import empty_star from "images/empty-star-icon.png";

export default React.createClass({
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
