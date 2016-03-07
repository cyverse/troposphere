define(function (require) {
  "use strict";

  var React = require('react'),
      Router = require('react-router'),
      Badge = require('./Badge.react'),
      actions = require('actions'),
      EarnedBadge = require('./EarnedBadge.react'),
      stores = require('stores'),
      actions = require('actions'),
      modals = require('modals'),
      RouteHandler = Router.RouteHandler;

  return React.createClass({
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
          assertions.push(model.get('assertionUrl'));
        });
        OpenBadges.issue(assertions);
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
          <div className="help">
          <button onClick={this.onExport} className="btn btn-primary">Export badges to Mozilla backpack</button>
          <br />
          <a onClick={this.showHelp}>What does this mean?</a>
          </div>
          <ul id="my-badges-list">
            {myBadgeDisplay}
          </ul>
        </div>
      );
    }

  });

});
