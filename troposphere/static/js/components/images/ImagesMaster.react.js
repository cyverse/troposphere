define(function (require) {
  "use strict";

  var React = require('react/addons'),
    Router = require('react-router'),
    RouteHandler = Router.RouteHandler,
    SecondaryImageNavigation = require('./common/SecondaryImageNavigation.react');

  return React.createClass({

    render: function () {
      return (
        <div>
          <SecondaryImageNavigation currentRoute="todo-remove-this"/>
          <RouteHandler/>
        </div>
      );
    }

  });

});
