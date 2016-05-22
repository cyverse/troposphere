define(function (require) {

  var React = require('react/addons'),
    stores = require('stores'),
    Router = require('react-router'),
    Glyphicon = require('components/common/Glyphicon.react'),
    context = require('context');

  return React.createClass({
    displayName: "SecondaryImageNavigation",

    renderRoute: function (name, linksTo, icon, requiresLogin) {
      if (requiresLogin && !context.hasLoggedInUser()) return null;

      return (
        <li key={name}>
          <Router.Link to={linksTo}>
            <Glyphicon name={icon}/>
            <span>{name}</span>
          </Router.Link>
        </li>
      )
    },

    render: function () {
      // only attempt to get bookmarks if there is a profile that might have them ...
      let userLoggedIn = context.hasLoggedInUser();
      let images = stores.ImageStore.getAll();

      let routes;
      if (!userLoggedIn) {
          routes = [
              this.renderRoute("Search", "search", "search", false),
              this.renderRoute("Tags", "tags", "tags", false)
          ];
      } else {
          let profile = stores.ProfileStore.get();
          let favoritedImages =  stores.ImageBookmarkStore.getBookmarkedImages();
          let userImages = stores.ImageStore.fetchWhere({
                created_by__username: profile.get('username')
          });


          if (!userImages || !favoritedImages) {
              return <div className="loading"></div>
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
                { routes }
              </ul>
            </div>
          </div>
        </div>
      );
    }
  });

});
