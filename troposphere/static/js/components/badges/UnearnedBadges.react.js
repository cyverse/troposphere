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

    check: function(){
      actions.BadgeActions.ask();
    },

    render: function () {
      // get around undefined email when calling from MyBadgeStore
      var email = stores.ProfileStore.get().get('email');
      if(!email){
        return(
          <div>
            <h1>Loading</h1>
          </div>
        )
      }
      var badges = stores.BadgeStore.getAll();
      var myBadges = stores.MyBadgeStore.getAll();
      var instanceHistory = stores.InstanceHistoryStore.getAll();
      var myBadgeIds = {};

      if(!badges || !myBadges || !instanceHistory){
        return(
          <div className="loading" />
        )
      }

      myBadges.map(function (badge) {
        myBadgeIds[badge.id] = 1;
      });

      var badgeDisplay = badges.map(function(badge) {
        var badgeId = badge.id;
        if (!myBadgeIds[badgeId]) {
          return (
            <Badge badge={badge} />
          )
        }
      });

      return (
        <div className="to-earn">
          <ul id="all-badges-list">
          {badgeDisplay}
          </ul>
        </div>
      );
    }

  });

});