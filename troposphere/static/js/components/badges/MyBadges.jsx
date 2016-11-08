import React from "react";
import Router from "react-router";
import EarnedBadge from "./EarnedBadge";
import stores from "stores";
import globals from "globals";
import modals from "modals";

export default React.createClass({
    displayName: "MyBadges",

    mixins: [Router.State],

    getInitialState: function() {
        var user = stores.ProfileStore.get();
        return {
            userEmail: user.get("email"),
            badges: "",
            myBadges: ""
        };
    },

    showHelp: function() {
        modals.BadgeModals.showHelp();
    },

    onExport: function() {
        var assertions = [];
        stores.MyBadgeStore.getAll().each(function(model) {
            // Send http url to backpack, not the https url that assertionUrl contains
            var assertionPieces = model.get("assertionUrl").split("/"),
                assertionId = assertionPieces[assertionPieces.length - 1],
                assertionUrl = globals.BADGE_ASSERTION_HOST + "/public/assertions/" + assertionId;

            assertions.push(assertionUrl);
        });
    // FIXME: cannot find the object definition for `OpenBadges`
    //OpenBadges.issue(assertions);
    },

    render: function() {
        // get around undefined email when calling from MyBadgeStore
        var email = stores.ProfileStore.get().get("email");
        if (!email) {
            return (
            <div>
                <h1 className="t-headline">Loading</h1>
            </div>
            )
        }
        var myBadges = stores.MyBadgeStore.getAll();

        if (!myBadges) {
            return (
            <div className="loading" />
            )
        }

        if (myBadges.length == 0) {
            return (
            <div className="mine">
                <h4  className="t-title"onClick={this.check}>Check badges</h4> You haven't earned any badges yet.
            </div>
            )
        }

        var myBadgeDisplay = myBadges.map(function(badge) {
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
