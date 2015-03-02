define(function(require){

  var React = require('react'),
      Router = require('react-router'),
      Glyphicon = require('components/common/Glyphicon.react'),
      context = require('context');

  return React.createClass({

    renderRoute: function(name, linksTo, icon, requiresLogin){
      if(requiresLogin && !context.profile) return null;

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
      return (
        <div>
          <div className="secondary-nav">
            <div className="container">
              <ul className="secondary-nav-links">
                {this.renderRoute("Search", "search", "search", false)}
                {this.renderRoute("Favorites", "favorites", "bookmark", true)}
                {this.renderRoute("My Images", "authored", "user", true)}
                {this.renderRoute("Tags", "tags", "tags", false)}
              </ul>
            </div>
          </div>
        </div>
      );
    }

  });

});
