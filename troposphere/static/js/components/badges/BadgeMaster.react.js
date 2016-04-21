import React from 'react';
import Router from 'react-router';
import actions from 'actions';
import stores from 'stores';
import Glyphicon from 'components/common/Glyphicon.react';
import context from 'context';

var BadgeMaster = React.createClass({
    displayName: "BadgeMaster",

    mixins: [Router.State],

    renderRoute: function (name, linksTo, icon, requiresLogin) {
      if (requiresLogin && !context.profile.get('selected_identity')) return null;

      return (
        <li key={name}>
          <Router.Link to={linksTo}>
            <Glyphicon name={icon}/>
            <span>{name}</span>
          </Router.Link>
        </li>
      )
    },

    render: function(){
      var profile = stores.ProfileStore.get(),
          RouteHandler = Router.RouteHandler,
          badges = stores.BadgeStore.getAll(),
          myBadges = stores.MyBadgeStore.getAll();

      if(!badges || !myBadges){
        return <div className="loading" />
      }

      return(
        <div>
            <div className="secondary-nav">
                <div className="container">
                    <ul className="secondary-nav-links">
                        {this.renderRoute("My Badges", "my-badges", "star", true)}
                        {this.renderRoute("Unearned Badges", "unearned-badges", "tasks", true)}
                        {this.renderRoute("All Badges", "all-badges", "th-list", false)}
                    </ul>
                </div>
            </div>
            <RouteHandler />
        </div>
      );
    }

});

export default BadgeMaster;
