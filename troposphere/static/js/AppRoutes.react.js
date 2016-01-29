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
    RequestHistory = require('./components/requests/ResourceHistoryMaster.react'),
    RequestMaster = require('./components/requests/RequestMaster.react'),
    DashboardPage = require('./components/dashboard/DashboardPage.react'),
    ProjectListPage = require('./components/projects/ProjectListPage.react'),
    ImageListPage = require('./components/images/ImageListPage.react'),
    ImageDetailsPage = require('./components/images/ImageDetailsPage.react'),
    ProvidersMaster = require('./components/providers/ProvidersMaster.react'),
    ProviderListSection = require('./components/providers/ProviderListSection.react'),
    ProviderDetail = require('./components/providers/ProviderDetail.react'),
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
    SettingsPage = require('./components/settings/SettingsPage.react'),
    ProjectInstancePage = require("./components/projects/InstanceDetailsPage.react"),
    ProjectVolumePage = require("./components/projects/VolumeDetailsPage.react"),
    AdminMaster = require('./components/admin/AdminMaster.react'),
    AtmosphereUserMaster = require('./components/admin/AtmosphereUserMaster.react'),
    ImageMaster = require('./components/admin/ImageMaster.react'),
    IdentityMembershipMaster = require('./components/admin/IdentityMembershipMaster.react'),
    ResourceMaster = require('./components/admin/ResourceMaster.react'),
    ResourceRequest = require('./components/admin/ResourceRequest.react');

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
        <DefaultRoute handler={ProviderListSection} />
        <Route name="provider" path=":id" handler={ProviderDetail}/>
        <Route name="all-providers" path="/" handler={ProviderListSection} />
      </Route>

      <Route name="help" handler={HelpPage}/>
      <Route name="settings" handler={SettingsPage}/>

      <Route name="admin" handler={AdminMaster}>
/*
        <Route name="identity-membership-manager" path="users" handler={IdentityMembershipMaster}/>
        <Route name="resource-request-manager" path="resource-requests" handler={ResourceMaster}>
          <Route name="resource-request" path=":resourceRequestId" handler={ResourceAdmin} />
        </Route>
        <Route name="image-request-manager" path="imaging-requests" handler={ImageMaster}>
          <Route name="image-request" path=":imageRequestId" handler={ImageAdmin} />
        </Route>
        <DefaultRoute handler={IdentityMembershipMaster}/>
*/
        <Route name="atmosphere-user-manager" path="users" handler={AtmosphereUserMaster}/>
        <Route name="identity-membership-manager" path="identities" handler={IdentityMembershipMaster}/>
        <Route name="resource-request-manager" path="resource-requests" handler={ResourceMaster} />
        <Route name="image-request-manager" path="imaging-requests" handler={ImageMaster} />
        <DefaultRoute handler={AtmosphereUserMaster}/>

      </Route>

      <Route name="badges" handler={BadgeMaster}>
        <Route name="my-badges" path="my-badges" handler={MyBadges} />
        <Route name="all-badges" path="all-badges" handler={AllBadges} />
        <Route name="unearned-badges" path="unearned-badges" handler={UnearnedBadges} />
      </Route>

      <Route name="my-requests" handler={RequestMaster}>
        <Route name="my-requests-resources" path="resources" handler={RequestHistory} />
        <Route name="my-requests-images" path="images" handler={MyImageRequestsPage} />
      </Route>

      <DefaultRoute handler={DashboardPage}/>

    </Route>
  );

  return AppRoutes;
});
