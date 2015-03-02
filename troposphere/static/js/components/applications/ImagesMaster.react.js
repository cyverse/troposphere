define(function (require) {
  "use strict";

  var React = require('react'),
      Router = require('react-router'),
      RouteHandler = Router.RouteHandler,
      SecondaryApplicationNavigation = require('./common/SecondaryApplicationNavigation.react');

  return React.createClass({

    render: function () {
      return (
        <div>
          <SecondaryApplicationNavigation currentRoute="todo-remove-this"/>
          <RouteHandler/>
        </div>
      );
    }

  });

});