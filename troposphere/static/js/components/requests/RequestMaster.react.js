define(function (require) {

  var React = require('react/addons'),
    stores = require('stores'),
    SecondaryRequestNavigation = require('./SecondaryRequestNavigation.react'),
    Router = require('react-router'),
    RouteHandler = Router.RouteHandler;

  return React.createClass({
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

});
