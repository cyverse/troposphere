import React from 'react';
import Router from 'react-router';
import BadgeList from './BadgeList.react';
import stores from 'stores';


export default React.createClass({
    displayName: "AllBadges",

    mixins: [Router.State],

    render: function() {
        var badges = stores.BadgeStore.getAll();

        if (!badges) {
            return (
            <div className="loading" />
            )
        }

        return (
        <div className="all badges container">
            <BadgeList badges={ badges } title={ "All Badges" } />
        </div>
        );
    }
});
