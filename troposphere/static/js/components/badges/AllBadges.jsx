import React from "react";
import Router from "react-router";
import Badge from "./Badge";
import stores from "stores";

export default React.createClass({
    displayName: "AllBadges",

    mixins: [Router.State],

    getInitialState: function() {
        var user = stores.ProfileStore.get();
        return {
            userEmail: user.get("email"),
            badges: "",
            myBadges: ""
        };
    },

    render: function() {
        var badges = stores.BadgeStore.getAll();

        if (!badges) {
            return (
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
