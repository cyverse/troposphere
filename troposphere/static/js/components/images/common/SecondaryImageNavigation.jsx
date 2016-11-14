import React from "react";
import stores from "stores";
import Router from "react-router";
import Glyphicon from "components/common/Glyphicon";
import context from "context";

export default React.createClass({
    displayName: "SecondaryImageNavigation",

    renderRoute: function(name, linksTo, icon, requiresLogin) {
        if (requiresLogin && !context.hasLoggedInUser()) return null;

        return (
        <li key={name}>
            <Router.Link to={linksTo}>
                <Glyphicon name={icon} />
                <span>{name}</span>
            </Router.Link>
        </li>
        )
    },

    render: function() {
        // Only attempt to get bookmarks if there is a profile that might have them ...
        let userLoggedIn = context.hasLoggedInUser();

        let routes;
        if (!userLoggedIn) {
            routes = [
                this.renderRoute("Search", "search", "search", false),
                this.renderRoute("Tags", "tags", "tags", false)
            ];
        } else {
            let profile = stores.ProfileStore.get();
            let favoritedImages = stores.ImageBookmarkStore.getBookmarkedImages();
            let userImages = stores.ImageStore.fetchWhere({
                created_by__username: profile.get("username")
            });


            if (!userImages || !favoritedImages) {
                // Rendering the secondary-nav without links as a place holder
                return <div style={{ height: "63px" }} className="secondary-nav"/>
            }

            let myImagesText = `My Images (${userImages.length})`;
            let myFavoritedImagesText = `Favorites (${favoritedImages.length})`;

            routes = [
                this.renderRoute("Search", "search", "search", false),
                this.renderRoute(myFavoritedImagesText, "favorites", "bookmark", true),
                this.renderRoute(myImagesText, "authored", "user", true),
                this.renderRoute("My Image Requests", "my-image-requests", "export", true),
                this.renderRoute("Tags", "tags", "tags", false),
            ];
        }

        return (
        <div>
            <div className="secondary-nav">
                <div className="container">
                    <ul className="secondary-nav-links">
                        {routes}
                    </ul>
                </div>
            </div>
        </div>
        );
    }
});
