define(function (require) {
  "use strict";

  var React = require('react'),
      Router = require('react-router'),
      RouteHandler = Router.RouteHandler;

  return React.createClass({

    mixins: [Router.State],

    render: function () {
      return (
        <RouteHandler/>
      );
    }

  });

});