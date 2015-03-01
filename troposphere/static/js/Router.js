define(function (require) {
  'use strict';

  var Router = require('react-router'),
      routes = require('./AppRoutes.react');

  // router singleton
  var _router;

  // create the router and assign to the singleton
  function createRouter() {
    _router = Router.create({
      routes: routes
      //location: Router.HistoryLocation
    });
  }

  return {

    // get or create the router
    getInstance: function () {
      if (!_router) createRouter();
      return _router;
    }

  };

});