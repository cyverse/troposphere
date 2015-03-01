define(function (require) {
  "use strict";

  var React = require('react'),
      stores = require('stores');

  // Routing
  var Router = require('react-router'),
      RouteHandler = Router.RouteHandler;

  return React.createClass({

    mixins: [Router.State],

    // --------------
    // Render Helpers
    // --------------

    render: function () {
      return (
        <div>
          <h2>Master Test</h2>
          <RouteHandler/>
        </div>
      );
    }

  });

});