define(function (require) {
  "use strict";

  var React = require('react/addons'),
    Router = require('react-router'),
    Route = Router.Route,
    Redirect = Router.Redirect,
    DefaultRoute = Router.DefaultRoute;

  var Master = require('./components/Master.react'),
    BadgeMaster = require('./components/badges/BadgeMaster.react'),
    MyBadges = require('./components/badges/MyBadges.react'),
    AllBadges = require('./components/badges/AllBadges.react'),
    UnearnedBadges = require('./components/badges/UnearnedBadges.react'),
    PassThroughHandler = require('./components/PassThroughHandler.react'),
    DashboardPage = require('./components/dashboard/DashboardPage.react'),
    ProjectListPage = require('./components/projects/ProjectListPage.react'),
    ImageListPage = require('./components/images/ImageListPage.react'),
    ImageDetailsPage = require('./components/images/ImageDetailsPage.react'),
    ProviderDetailsPage = require('./components/providers/ProviderListView.react'),
    HelpPage = require('./components/help/HelpPage.react'),
    ProjectsMaster = require('./components/projects/ProjectsMaster.react'),
    ProjectDetailsMaster = require('./components/projects/detail/ProjectDetailsMaster.react'),
    ProjectDetailsPage = require('./components/projects/ProjectDetailsPage.react'),
    ProjectResourcesPage = require('./components/projects/ProjectResourcesPage.react'),
    FavoritedImagesPage = require('./components/images/FavoritedImagesPage.react'),
    MyImagesPage = require('./components/images/MyImagesPage.react'),
    MyImageRequestsPage = require('./components/images/MyImageRequestsPage.react'),
    ImageTagsPage = require('./components/images/ImageTagsPage.react'),
    ImagesMaster = require('./components/images/ImagesMaster.react'),
    ProvidersMaster = require('./components/providers/ProvidersMaster.react'),
    SettingsPage = require('./components/settings/SettingsPage.react'),
    ProjectInstancePage = require("./components/projects/InstanceDetailsPage.react"),
    ProjectVolumePage = require("./components/projects/VolumeDetailsPage.react"),
    ResourceMaster = require('./components/admin/ResourceMaster.react'),
    ResourceRequest = require('./components/admin/ResourceRequest.react'),
    AdminMaster = require('./components/admin/AdminMaster.react'),
    ImageMaster = require('./components/admin/ImageMaster.react'),
    ImageAdmin = require('./components/admin/ImageAdmin.react'),
    ResourceAdmin = require('./components/admin/ResourceAdmin.react');

  var AppRoutes = (
    <Route name="root" path="/application" handler={Master}>
      <Route name="dashboard" handler={DashboardPage}/>

      <Route name="projects" handler={ProjectsMaster}>
        <Route name="project" path=":projectId" handler={ProjectDetailsMaster}>
          <Route name="project-details" path="details" handler={ProjectDetailsPage}/>
          <Route name="project-resources" path="resources" handler={ProjectResourcesPage}/>
          <Route name="project-instance-details" path="instances/:instanceId" handler={ProjectInstancePage}/>
          <Route name="project-volume-details" path="volumes/:volumeId" handler={ProjectVolumePage}/>
          <DefaultRoute handler={ProjectDetailsPage}/>
        </Route>

        <DefaultRoute handler={ProjectListPage}/>
      </Route>

      <Route name="images" handler={ImagesMaster}>
        <DefaultRoute name="search" handler={ImageListPage}/>
        <Route name="favorites" handler={FavoritedImagesPage}/>
        <Route name="authored" handler={MyImagesPage}/>
        <Route name="my-image-requests" handler={MyImageRequestsPage}/>
        <Route name="tags" handler={ImageTagsPage}/>
        <Route name="image-details" path=":imageId" handler={ImageDetailsPage}/>
      </Route>

      <Route name="providers" handler={ProvidersMaster}>
        <Route name="provider" path=":providerId" handler={ProviderDetailsPage}/>
        <DefaultRoute handler={ProviderDetailsPage}/>
      </Route>

      <Route name="help" handler={HelpPage}/>
      <Route name="settings" handler={SettingsPage}/>

      <Route name="admin" handler={AdminMaster}>
        <Route name="resource-request-manager" path="resource-requests" handler={ResourceMaster}>
          <Route name="resource-request" path=":resourceRequestId" handler={ResourceAdmin} />
        </Route>
        <Route name="image-request-manager" path="imaging-requests" handler={ImageMaster}>
          <Route name="image-request" path=":imageRequestId" handler={ImageAdmin} />
        </Route>
      </Route>

      <Route name="badges" handler={BadgeMaster}>
        <Route name="my-badges" path="my-badges" handler={MyBadges} />
        <Route name="all-badges" path="all-badges" handler={AllBadges} />
        <Route name="unearned-badges" path="unearned-badges" handler={UnearnedBadges} />
      </Route>

      <DefaultRoute handler={DashboardPage}/>

    </Route>
  );

  return AppRoutes;
});
