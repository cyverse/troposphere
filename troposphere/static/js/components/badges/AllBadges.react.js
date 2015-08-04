define(function (require) {
  "use strict";

  var React = require('react'),
      Router = require('react-router'),
      Badge = require('./Badge.react'),
      actions = require('actions'),
      EarnedBadge = require('./EarnedBadge.react'),
      stores = require('stores'),
      RouteHandler = Router.RouteHandler;

  return React.createClass({

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
      // get around undefined email when calling from MyBadgeStore
      var email = stores.ProfileStore.get().get('email');
      if(!email){
        return(
          <div>h
            <h1>Loading</h1>
          </div>
        )
      }
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