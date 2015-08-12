define(function (require) {
  "use strict";

  var React = require('react'),
      Router = require('react-router'),
      Badge = require('./Badge.react'),
      actions = require('actions'),
      EarnedBadge = require('./EarnedBadge.react'),
      stores = require('stores'),
      actions = require('actions'),
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
      var myBadges = stores.MyBadgeStore.getAll();

      if(!myBadges){
        return(
          <div className="loading" />
        )
      }

      if(myBadges.length == 0){
        return (
          <div className="mine">
            <h4 onClick={this.check}>Check badges</h4>
            You haven't earned any badges yet.
          </div>
        )
      }

      var myBadgeDisplay = myBadges.map(function (badge) {
        return (
          <EarnedBadge badge={badge} />
        )
      });

      return (
        <div className="mine">
          <h4 onClick={this.check}>Check badges</h4>
          <ul id="my-badges-list">
          {myBadgeDisplay}
          </ul>
        </div>
      );
    }

  });

});
