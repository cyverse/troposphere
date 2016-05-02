import React from 'react';
import Router from 'react-router';
import actions from 'actions';
import stores from 'stores';
import context from 'context';

var BadgeMaster = React.createClass({
    displayName: "BadgeMaster",

    mixins: [Router.State],

    renderRoute: function (name, linksTo, requiresLogin) {
      if (requiresLogin && !context.profile.get('selected_identity')) return null;

      return (
        <li key={name}>
          <Router.Link to={linksTo}>
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
                        {this.renderRoute("My Badges", "my-badges", true)}
                        {this.renderRoute("Unearned Badges", "unearned-badges", true)}
                        {this.renderRoute("All Badges", "all-badges", false)}
                    </ul>
                </div>
            </div>
            <RouteHandler />
        </div>
      );
    }

});

export default BadgeMaster;
