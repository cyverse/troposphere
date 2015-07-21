define(function (require) {
  "use strict";

  var Router = require('react-router'),
    Route = Router.Route,
    Redirect = Router.Redirect,
    DefaultRoute = Router.DefaultRoute;

  var Master = require('components/Master.react'),
    ImageListPage = require('components/applications/ApplicationListPage.react'),
    ImageDetailsPage = require('components/applications/ApplicationDetailsPage.react'),
    HelpPage = require('components/help/HelpPage.react'),
    ImageTagsPage = require('components/applications/ImageTagsPage.react'),
    ImagesMaster = require('components/applications/ImagesMaster.react');

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
