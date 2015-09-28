define(function (require) {
  "use strict";

  var React = require('react/addons'),
    Router = require('react-router'),
    RouteHandler = Router.RouteHandler,
    SecondaryAdminNavigation = require('./SecondaryAdminNavigation.react');

  return React.createClass({
    displayName: "AdminMaster",

    render: function () {
      return (
        <div>
          <SecondaryAdminNavigation currentRoute="todo-remove-this"/>
          <RouteHandler/>
        </div>
      );
    }

  });

});
