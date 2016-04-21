import React from 'react';
import Router from 'react-router';
import actions from 'actions';
import stores from 'stores';
import BadgeList from './BadgeList.react';

var AllBadges = React.createClass({
    displayName: "AllBadges",

    mixins: [Router.State],

    render: function () {
      var badges = stores.BadgeStore.getAll();

      if(!badges){
        return(
          <div className="loading" />
        )
      }

      return (
        <div className="all badges container">
            <BadgeList badges={badges} title={"All Badges"} />
        </div>
      );
    }

});

export default AllBadges;
