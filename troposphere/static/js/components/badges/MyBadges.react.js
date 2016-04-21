import React from 'react';
import Router from 'react-router';
import stores from 'stores';
import BadgeList from './BadgeList.react';
import globals from 'globals';
import modals from 'modals';

var MyBadges = React.createClass({
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

    showHelp: function(){
        modals.BadgeModals.showHelp();
    },

    onExport: function(){
        var assertions = [];
        stores.MyBadgeStore.getAll().each(function(model){
          // Send http url to backpack, not the https url that assertionUrl contains
          var assertionPieces = model.get('assertionUrl').split('/'),
              assertionId = assertionPieces[assertionPieces.length - 1],
              assertionUrl = globals.BADGE_ASSERTION_HOST + "/public/assertions/" + assertionId;

          assertions.push(assertionUrl);
        });
        OpenBadges.issue(assertions);
    },

    render: function () {
      if(!stores.MyBadgeStore.getAll()){
        return(
          <div className="loading" />
        )
      }

      var myBadges = stores.BadgeStore.getAll().filter(function(badge){
        if(stores.MyBadgeStore.has(badge.id)){
            return badge;
        }
      });

      if(myBadges.length == 0){
        return (
          <div className="mine">
            {"You haven't earned any badges yet."}
          </div>
        );
      }

      return (
        <div className="mine badges container">
            <button onClick={this.onExport} className="btn btn-primary">Export badges to Mozilla backpack</button>
            <br />
            <a onClick={this.showHelp}>What does this mean?</a>
            <BadgeList badges={myBadges} title={"My Badges"} />
        </div>
      );
    }

});

export default MyBadges;
