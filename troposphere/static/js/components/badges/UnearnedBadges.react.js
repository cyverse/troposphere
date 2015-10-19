define(function (require) {
  "use strict";

  var React = require('react'),
      Router = require('react-router'),
      Badge = require('./Badge.react'),
      Badges = require('Badges'),
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

    grantDemo: function(){
        actions.BadgeActions.checkOrGrant(Badges.DEMO_BADGE);
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

      // build a list of badge IDs that the user has
      myBadges.map(function (badge) {
        myBadgeIds[badge.id] = 1;
      });

      var empty = true;
      // get every ID in total badge store that the user does not have
      var badgeDisplay = badges.map(function(badge) {
        var badgeId = badge.id;
        if (!myBadgeIds[badgeId]) {
          empty = false;
          return (
            <Badge badge={badge} />
          )
        }
      });

      if(empty){
        return (
          <div>You have earned every single badge! There should be a badge for that!</div>
        );
      }

      return (
        <div className="to-earn">
          <button className="btn btn-info" onClick = {this.grantDemo}>Earn demo badge</button>
          <ul id="all-badges-list">
          {badgeDisplay}
          </ul>
        </div>
      );
    }

  });

});
