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
      ProviderDetailsPage = require('./components/providers/ProviderListView.react'),
      HelpPage = require('./components/help/HelpPage.react'),
      ProjectDetailsMaster = require('./components/projects/detail/ProjectDetailsMaster.react'),
      ProjectDetailsPage = require('./components/projects/ProjectDetailsPage.react'),
      ProjectResourcesPage = require('./components/projects/ProjectResourcesPage.react'),
      FavoritedImagesPage = require('./components/applications/FavoritedApplicationsPage.react'),
      MyImagesPage = require('./components/applications/MyApplicationsPage.react'),
      ImageTagsPage = require('./components/applications/ImageTagsPage.react'),
      ImagesMaster = require('./components/applications/ImagesMaster.react'),
      ProvidersMaster = require('./components/providers/ProvidersMaster.react'),
      SettingsPage = require('./components/settings/SettingsPage.react'),
      ProjectInstancePage = require("./components/projects/InstanceDetailsPage.react"),
      ProjectVolumePage = require("./components/projects/VolumeDetailsPage.react");

  var AppRoutes = (
    <Route name="root" path="/application" handler={Master}>
      <Route name="dashboard" handler={DashboardPage}/>
      <Route name="projects" handler={ProjectListPage}/>

      <Route name="images" handler={ImagesMaster}>
        <Route name="search" handler={ImageListPage}/>
        <Route name="favorites" handler={FavoritedImagesPage}/>
        <Route name="authored" handler={MyImagesPage}/>
        <Route name="tags" handler={ImageTagsPage}/>
        <Route name="image-details" path=":imageId" handler={ImageDetailsPage}/>
        <DefaultRoute handler={ImageListPage}/>
      </Route>

      <Route name="providers" handler={ProvidersMaster}>
        <Route name="provider" path=":providerId" handler={ProviderDetailsPage}/>
      </Route>

      <Route name="help" handler={HelpPage}/>
      <Route name="settings" handler={SettingsPage}/>

      <Route name="project" path="projects/:projectId" handler={ProjectDetailsMaster}>
        <Route name="project-details" path="details" handler={ProjectDetailsPage}/>
        <Route name="project-resources" path="resources" handler={ProjectResourcesPage}/>
        <Route name="project-instance-details" path="instances/:instanceId" handler={ProjectInstancePage}/>
        <Route name="project-volume-details" path="volumes/:volumeId" handler={ProjectVolumePage}/>
        <DefaultRoute handler={ProjectDetailsPage}/>
      </Route>

      <DefaultRoute handler={MasterTest}/>
    </Route>
  );

  return AppRoutes;
});
