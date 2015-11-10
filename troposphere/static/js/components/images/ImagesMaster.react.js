define(function (require) {
  "use strict";

  var React = require('react/addons'),
    Router = require('react-router'),
    RouteHandler = Router.RouteHandler,
    SecondaryImageNavigation = require('./common/SecondaryImageNavigation.react');

  return React.createClass({
    displayName: "ImagesMaster",

    render: function () {
      return (
        <div>
          <SecondaryImageNavigation />
          <RouteHandler/>
        </div>
      );
    }

  });

});
