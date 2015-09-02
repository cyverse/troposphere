define(function (require) {

  var React = require('react/addons'),
    stores = require('stores'),
    Router = require('react-router'),
    Glyphicon = require('components/common/Glyphicon.react'),
    context = require('context');

  return React.createClass({

    renderRoute: function (name, linksTo, icon, requiresLogin) {
      if (requiresLogin && !context.profile) return null;

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
          images = stores.ImageStore.fetchWhere({
            created_by__username: profile.get('username')
          });

      if(!images){
        return <div className="loading"></div>
      }

      var myImagesText = "My Images (" + images.length + ")";

      return (
        <div>
          <div className="secondary-nav">
            <div className="container">
              <ul className="secondary-nav-links">
                {this.renderRoute("Search", "search", "search", false)}
                {this.renderRoute("Favorites", "favorites", "bookmark", true)}
                {this.renderRoute(myImagesText, "authored", "user", true)}
                {this.renderRoute("Tags", "tags", "tags", false)}
              </ul>
            </div>
          </div>
        </div>
      );
    }

  });

});
