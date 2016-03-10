define(function (require) {
  "use strict";

  var React = require('react'),
      Router = require('react-router'),
      Badge = require('./Badge.react'),
      actions = require('actions'),
      stores = require('stores'),
      RouteHandler = Router.RouteHandler;

  return React.createClass({
    displayName: "AllBadges",

    mixins: [Router.State],

    getInitialState: function() {
      var user = stores.ProfileStore.get();
      return{
        userEmail: user.get('email'),
        badges: "",
        myBadges: ""
      };
    },

    render: function () {
      var badges = stores.BadgeStore.getAll();

      if(!badges){
        return(
          <div className="loading" />
        )
      }

      var badgeDisplay = badges.map(function(badge) {
        return (
          <Badge badge={badge} />
        )
      });

      return (
        <div className="all">
          <ul id="all-badges-list">
          {badgeDisplay}
          </ul>
        </div>
      );
    }

  });

});
