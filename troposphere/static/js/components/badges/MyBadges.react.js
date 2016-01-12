import React from 'react';
import Router from 'react-router';
import Badge from './Badge.react';
import EarnedBadge from './EarnedBadge.react';
import stores from 'stores';
import actions from 'actions';

let RouteHandler = Router.RouteHandler;

export default React.createClass({
    displayName: "MyBadges",

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
          <ul id="my-badges-list">
          {myBadgeDisplay}
          </ul>
        </div>
      );
    }
});
