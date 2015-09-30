define(function (require) {
  "use strict";

  var React = require('react'),
      Router = require('react-router'),
      stores = require('stores'),
      ResourceMaster = require('./ResourceMaster.react'),
      ImageMaster = require('./ImageMaster.react'),
      RouteHandler = Router.RouteHandler;

  return React.createClass({

    mixins: [Router.State],

    render: function () {
      return (
        <div className = "container admin">
          <span className="adminHeader">
            <h1>Admin</h1>
            <Router.Link to="identity-membership-manager">
              <div className="btn btn-default">Manage Users</div>
            </Router.Link>
            <Router.Link to="resource-request-manager">
              <div className="btn btn-default">Resource Requests</div>
            </Router.Link>
            <Router.Link to="image-request-manager">
              <div className="btn btn-default">Imaging Requests</div>
            </Router.Link>
          <RouteHandler />
          </span>
        </div>
      );
    }

  });

}); 
