define(function (require) {
  "use strict";

  var React = require('react/addons'),
    Router = require('react-router'),
    RouteHandler = Router.RouteHandler;

  return React.createClass({

    render: function () {
      return (
        <RouteHandler/>
      );
    }

  });

});
