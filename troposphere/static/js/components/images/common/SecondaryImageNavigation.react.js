define(function (require) {

  var React = require('react/addons'),
    stores = require('stores'),
    Router = require('react-router'),
    Glyphicon = require('components/common/Glyphicon.react'),
    context = require('context');

  return React.createClass({
    displayName: "SecondaryImageNavigation",

    renderRoute: function (name, linksTo, icon, requiresLogin) {
      if (requiresLogin && !context.profile.get('selected_identity')) return null;

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
      var profile = stores.ProfileStore.get(),
          allImages = stores.ImageStore.getAll(),
          images = stores.ImageStore.fetchWhere({
            created_by__username: profile.get('username')
          }) || [];

      // only attempt to get bookmarks if there is a profile that might have them ...
      var userLoggedIn = !!(profile && profile.get('selected_identity')),
        favoritedImages =  userLoggedIn ? stores.ImageBookmarkStore.getBookmarkedImages() : [];

      if(!images || (userLoggedIn && !favoritedImages)){
        return <div className="loading"></div>
      }

      var myImagesText = "My Images (" + images.length + ")";
      var myFavoritedImagesText = "Favorites (" + favoritedImages.length + ")";

      return (
        <div>
          <div className="secondary-nav">
            <div className="container">
              <ul className="secondary-nav-links">
                {this.renderRoute("Search", "search", "search", false)}
                {this.renderRoute(myFavoritedImagesText, "favorites", "bookmark", true)}
                {this.renderRoute(myImagesText, "authored", "user", true)}
                {this.renderRoute("My Image Requests", "my-image-requests", "export", true)}
                {this.renderRoute("Tags", "tags", "tags", false)}
              </ul>
            </div>
          </div>
        </div>
      );
    }

  });

});
