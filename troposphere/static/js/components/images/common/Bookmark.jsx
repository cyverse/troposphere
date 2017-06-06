import React from "react";
import actions from "actions";
import stores from "stores";
import subscribe from 'utilities/subscribe';
import filled_star from "images/filled-star-icon.png";
import empty_star from "images/empty-star-icon.png";

const Bookmark = React.createClass({
    displayName: "CommonBookmark",

    updateState: function() {
        this.forceUpdate();
    },

    componentDidMount: function() {
       stores.ImageBookmarkStore.addChangeListener(this.updateState);
    },

    componentWillUnmount: function() {
       stores.ImageBookmarkStore.removeChangeListener(this.updateState);
    },

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
        let isFavorited = stores.ImageBookmarkStore.findOne({
            "image.id": image.id
        });
        let img = isFavorited ? filled_star : empty_star;

        return (
        <span
            style={{ cursor: "pointer" }}
            onClick={this.toggleFavorite}
        >
            <img width={ this.props.width } src={ img }/>
        </span>
        );
    }
});

export default subscribe( Bookmark, ["ImageBookmarkStore"]);
