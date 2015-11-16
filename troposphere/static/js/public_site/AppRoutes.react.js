define(function (require) {
  "use strict";

  var React = require('react/addons'),
    Router = require('react-router'),
    Route = Router.Route,
    Redirect = Router.Redirect,
    DefaultRoute = Router.DefaultRoute;

  var Master = require('components/Master.react'),
      HelpPage = require('components/help/HelpPage.react'),
      ImageListPage = require('components/images/ImageListPage.react'),
      FavoritedImagesPage = require('components/images/FavoritedImagesPage.react'),
      MyImagesPage = require('components/images/MyImagesPage.react'),
      MyImageRequestsPage = require('components/images/MyImageRequestsPage.react'),
      ImageDetailsPage = require('components/images/ImageDetailsPage.react'),
      ImageTagsPage = require('components/images/ImageTagsPage.react'),
      ImagesMaster = require('components/images/ImagesMaster.react');

  var AppRoutes = (
    <Route name="root" path="/application" handler={Master}>
      <Route name="images" handler={ImagesMaster}>
        <DefaultRoute name="search" handler={ImageListPage}/>
        <Route name="favorites" handler={FavoritedImagesPage}/>
        <Route name="authored" handler={MyImagesPage}/>
        <Route name="my-image-requests" handler={MyImageRequestsPage}/>
        <Route name="tags" handler={ImageTagsPage}/>
        <Route name="image-details" path=":imageId" handler={ImageDetailsPage}/>
      </Route>
      <Route name="help" handler={HelpPage}/>
      <Redirect from="/application" to="/application/images"/>
    </Route>
  );

  return AppRoutes;
});
