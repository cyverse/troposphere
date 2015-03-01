define(function (require) {
  "use strict";

  var React = require('react'),
      Router = require('react-router'),
      Route = Router.Route,
      Redirect = Router.Redirect,
      DefaultRoute = Router.DefaultRoute;

  var Master = require('./components/Master.react'),
      MasterTest = require('./components/MasterTest.react');

  var AppRoutes = (
    <Route name="root" path="/" handler={Master}>
      <Route handler={MasterTest}/>

      <DefaultRoute handler={MasterTest}/>
    </Route>
  );

  return AppRoutes;
});
