import React from "react";
import actions from "actions";
import stores from "stores";
// images
import filled_star from "images/filled-star-icon.png";
import empty_star from "images/empty-star-icon.png";

export default React.createClass({
    displayName: "CommonBookmark",

    toggleFavorite: function(e) {
        e.stopPropagation();
        e.preventDefault();
        var image = this.props.image,
            imageBookmark = stores.ImageBookmarkStore.findOne({
                "image.id": image.id
            });

        if (imageBookmark) {
            actions.ImageBookmarkActions.removeBookmark({
                image: image
            });
        } else {
            actions.ImageBookmarkActions.addBookmark({
                image: image
            });
        }
    },

    render: function() {
        let image = this.props.image;
        let bookmarks = stores.ImageBookmarkStore.getAll();
        let isFavorited = bookmarks ? stores.ImageBookmarkStore.findOne({
            "image.id": image.id
        }) : null;

        let img = isFavorited ? filled_star : empty_star;

        return (
            <a href="#" onClick={this.toggleFavorite}>
                <img width={ this.props.width } src={ img }/>
            </a>
        );
    }
});
