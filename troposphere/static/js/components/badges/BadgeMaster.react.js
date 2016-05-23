import React from 'react';
import Router from 'react-router';
import Badge from './Badge.react';
import actions from 'actions';
import EarnedBadge from './EarnedBadge.react';
import stores from 'stores';


let RouteHandler = Router.RouteHandler;

export default React.createClass({
    displayName: "BadgeMaster",

    mixins: [Router.State],

    render: function(){
      return(
        <div className="container badges">
          <span className="buttons">
            <Router.Link to="my-badges">
              <div className="btn btn-default">My Badges</div>
            </Router.Link>
            <Router.Link to="unearned-badges">
              <div className="btn btn-default">Unearned Badges</div>
            </Router.Link>
            <Router.Link to="all-badges">
              <div className="btn btn-default">All Badges</div>
            </Router.Link>
          </span>
          <RouteHandler />
        </div>
      )
    }
});
