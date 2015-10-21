define(function (require) {
  "use strict";

  var React = require('react'),
      Router = require('react-router'),
      stores = require('stores'),
      ResourceMaster = require('./ResourceMaster.react'),
      ImageMaster = require('./ImageMaster.react'),
      SecondaryAdminNavigation = require('./SecondaryAdminNavigation.react'),
      RouteHandler = Router.RouteHandler;

  return React.createClass({

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

}); 
