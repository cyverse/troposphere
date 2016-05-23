import React from 'react';
import stores from 'stores';
import SecondaryRequestNavigation from './SecondaryRequestNavigation.react';
import Router from 'react-router';


let RouteHandler = Router.RouteHandler;

export default React.createClass({
    displayName: "MyRequestsPage",

    mixins: [Router.State],

    render: function() {
      return (
        <div>
            <SecondaryRequestNavigation/>
            <div className="container admin">
            <span className="adminHeader">
            <RouteHandler />
            </span>
            </div>
        </div>
      );
    }
});
