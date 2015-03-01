define(function (require) {
  "use strict";

  var React = require('react'),
      Router = require('react-router'),
      Route = Router.Route,
      Redirect = Router.Redirect,
      DefaultRoute = Router.DefaultRoute;

  var Master = require('./components/Master.react'),
      PassThroughHandler = require('./components/PassThroughHandler.react'),
      MasterTest = require('./components/MasterTest.react'),
      DashboardPage = require('./components/dashboard/DashboardPage.react'),
      ProjectListPage = require('./components/projects/ProjectListPage.react'),
      ImageListPage = require('./components/applications/ApplicationListPage.react'),
      ImageDetailsPage = require('./components/applications/ApplicationDetailsPage.react'),
      ProviderListPage = require('./components/providers/ProviderListPage.react'), // broken
      HelpPage = require('./components/help/HelpPage.react'),
      ProjectDetailsMaster = require('./components/projects/detail/ProjectDetailsMaster.react'),
      ProjectDetailsPage = require('./components/projects/ProjectDetailsPage.react'),
      ProjectResourcesPage = require('./components/projects/ProjectResourcesPage.react');

  //<Route name="dashboard" handler={Master}/>
  //<Route name="projects" handler={Master}/>
  //<Route name="project" path="projects/:projectId" handler={Master}>
  //  <Route name="project-details" path="details" handler={Master}/>
  //  <Route name="project-resources" path="resources" handler={Master}/>
  //  <Route name="project-instance" path="instances/:instanceId" handler={Master}/>
  //  <Route name="project-volume" path="volumes/:volumeId" handler={Master}/>
  //  <DefaultRoute handler={MasterTest}/>
  //</Route>
  //<Route name="images" handler={Master}/>
  //<Route name="image" path="images/:imageId" handler={Master}/>

  var AppRoutes = (
    <Route name="root" path="/application" handler={Master}>
      <Route name="dashboard" handler={DashboardPage}/>
      <Route name="projects" handler={ProjectListPage}/>
      <Route name="images" handler={ImageListPage}/>
      <Route name="providers" handler={ProviderListPage}/>
      <Route name="help" handler={HelpPage}/>

      <Route name="project" path="projects/:projectId" handler={ProjectDetailsMaster}>
        <Route name="project-details" path="details" handler={ProjectDetailsPage}/>
        <Route name="project-resources" path="resources" handler={ProjectResourcesPage}/>
        <DefaultRoute handler={ProjectDetailsPage}/>
      </Route>

      <Route name="image" path="images/:imageId" handler={ImageDetailsPage}/>

      <DefaultRoute handler={MasterTest}/>
    </Route>
  );

  return AppRoutes;
});
