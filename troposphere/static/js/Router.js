define(function (require) {
  'use strict';

  var Router = require('react-router');

  // router singleton
  var _router;

  // create the router and assign to the singleton
  function createRouter(routes) {
    _router = Router.create({
      routes: routes,
      location: Router.HistoryLocation
    });
  }

  return {

    // get or create the router
    getInstance: function (routes) {
      if (!_router) createRouter(routes);
      return _router;
    }

  };

});