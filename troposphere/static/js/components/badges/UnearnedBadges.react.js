import React from "react";
import Router from "react-router";
import BadgeList from "./BadgeList.react";
import stores from "stores";


export default React.createClass({
    displayName: "UnearnedBadges",

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
        var badges = stores.BadgeStore.getAll(),
            myBadges = stores.MyBadgeStore.getAll();

        if (!badges || !myBadges) {
            return (
            <div>
                <h1>Loading</h1>
            </div>
            )
        }

        var empty = true;
        var unearnedBadges = badges.filter(function(badge) {
            if (!stores.MyBadgeStore.has(badge.id)) {
                empty = false;
                return badge;
            }
        });

        if (empty) {
            return (
            <div>
                You have earned every single badge!
            </div>
            );
        }

        return (
        <div className="to-earn badges container">
            <BadgeList badges={ unearnedBadges } title={ "Unearned Badges" } />
        </div>
        );
    }
});
