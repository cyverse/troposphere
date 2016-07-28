import React from 'react';
import Router from 'react-router';
import stores from 'stores';
import SecondaryAdminNavigation from './SecondaryAdminNavigation.react';
import ResourceMaster from './ResourceMaster.react';
import ImageMaster from './ImageMaster.react';


let RouteHandler = Router.RouteHandler;

export default React.createClass({

    mixins: [Router.State],

    render: function () {
      return (
        <div>
            <SecondaryAdminNavigation/>
            <div className = "container admin">
            <span className="adminHeader">
                <h1>Admin</h1>
            <RouteHandler />
            </span>
            </div>
        </div>
      );
    }
});
