define(function (require) {
  "use strict";

  var React = require('react'),
      Router = require('react-router'),
      Badge = require('./Badge.react'),
      actions = require('actions'),
      EarnedBadge = require('./EarnedBadge.react'),
      stores = require('stores');

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

      if(!badges || !myBadges || !instanceHistory){
        return(
          <div className="loading" />
        )
      }

      var badgeDisplay = badges.map(function(badge) {
        return(
          <Badge badge={badge} />
        )
      });

      var myBadgeDisplay = myBadges.map(function (badge) {
        return (
          <EarnedBadge badge={badge} />
        )
      });

      return (
        <div className="container badge-page">
          <div id="check" onClick={this.check}>Check badges</div>
          <div id="all-badges">
            <h1>All Badges</h1>
              <ul id="all-badges-list">
              {badgeDisplay}
              </ul>
          </div>
          <div id="my-badges">
            <h1>My Badges</h1>
            <ul id="my-badges-list">
            {myBadgeDisplay}
            </ul>
          </div>
        </div>
      );
    }

  });

});