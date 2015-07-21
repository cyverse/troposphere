define(function (require) {
  "use strict";

  var React = require('react'),
    Router = require('react-router'),
    RouteHandler = Router.RouteHandler,
    stores = require('stores'),
    SecondaryProjectNavigation = require('../common/SecondaryProjectNavigation.react');

  return React.createClass({

    mixins: [Router.State],

    render: function () {
      var project = stores.ProjectStore.get(Number(this.getParams().projectId));

      if (!project) {
        return (
          <div className="loading"></div>
        )
      }

      return (
        <div className="project-details">
          <SecondaryProjectNavigation project={project} currentRoute="todo-remove-this"/>
          <RouteHandler/>
        </div>
      );
    }

  });

});
