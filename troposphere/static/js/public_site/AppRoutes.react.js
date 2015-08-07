define(function (require) {
  "use strict";

  var Router = require('react-router'),
    Route = Router.Route,
    Redirect = Router.Redirect,
    DefaultRoute = Router.DefaultRoute;

  var Master = require('components/Master.react'),
    ImageListPage = require('components/images/ApplicationListPage.react'),
    ImageDetailsPage = require('components/images/ApplicationDetailsPage.react'),
    HelpPage = require('components/help/HelpPage.react'),
    ImageTagsPage = require('components/images/ImageTagsPage.react'),
    ImagesMaster = require('components/images/ImagesMaster.react');

  var AppRoutes = (
    <Route name="root" path="/application" handler={Master}>
      <Route name="images" handler={ImagesMaster}>
        <DefaultRoute name="search" handler={ImageListPage}/>
        <Route name="tags" handler={ImageTagsPage}/>
        <Route name="image-details" path=":imageId" handler={ImageDetailsPage}/>
      </Route>
      <Route name="help" handler={HelpPage}/>
      <Redirect from="/application" to="/application/images"/>
    </Route>
  );

  return AppRoutes;
});
